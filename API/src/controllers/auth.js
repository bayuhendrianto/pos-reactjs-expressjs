const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  Users,
  Customers,
  Employees,
  Drivers,
  Roles,
  Companies
} = require("../models/index.model");
const express = require("express");
const router = express.Router();
const { v4: uuid } = require("uuid");
const dotenv = require("dotenv");
dotenv.config();
const { UpdateUser } = require("../services/user.services");
const { UserClass, RoleClass, CompanyClass } = require("../class/index.class");
const { randomNumbersLettersForPassword } = require("../middleware/util");

/**
 * Registrasi untuk user / balen app
 * -------------------------------------------------------------------------------------------------
 * Pseudocode
 *
 * 1. User/Customer registrasi akun di Mobile Apps
 * 2. Masukkan { nama awal, nama akhir, no.tlp, kata sandi, konfirmasi kata sandi }
 * 3. Cek apakah user dengan email yang dimasukkan sudah terdaftar
 * 4. Jika sudah maka kembalikan informasi bahwa user dengan email *** sudah terdaftar
 * 5. Cek apakah user dengan no.tlp yang dimasukkan sudah terdaftar
 * 6. Jika sudah maka kembalikan informasi bahwa user dengan no.tlp *** sudah terdaftar
 * 7. Jika validasi keduanya {email, no.tlp) belum terdaftar,
 *    selanjutnya simpan data user ke table 'Users dan Customers',
 *
 * Pilihan :
 * Apakah perlu verifikasi OTP via sms, jika iya setelah registrasi berhasil maka kirimkan OTP via sms.
 * Kemudian buat fungsi dari sisi FrontEnd untuk memasukkan kode verifikasi.
 */
router.post("/register", async (req, res) => {
  const { firstName, lastName, email, phoneNumber, password, confPassword } =
    req.body;
  const id = uuid();

  const findUserByEmail = await Users.findOne({
    where: {
      email: email,
    },
  });

  if (findUserByEmail !== null) {
    return res.status(400).send({
      message: "User with same email is already registered !",
    });
  }

  const findUserByPhoneNumber = await Users.findOne({
    where: {
      phoneNumber: phoneNumber,
    }
  });

  if (findUserByPhoneNumber) {
    return res.status(400).send({
      message: "User with same phone number is already registered !",
    });
  }

  if (password !== confPassword) {
    return res
      .status(400)
      .json({ message: "Password dan Confirm Password tidak cocok" });
  }

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  var fullName = "";

  if (lastName !== "" || lastName !== null) {
    fullName = firstName + " " + lastName;
  } else {
    fullName = firstName;
  }

  const accessToken = jwt.sign(
    { id, fullName, email },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );

  const refreshToken = jwt.sign(
    { id, fullName, email },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );

  let userData = {
    id: id,
    firstName: firstName,
    fullName: fullName,
    lastName: lastName,
    email: email,
    phoneNumber: phoneNumber,
    password: hashPassword,
    group: "customer",
    refresh_token: refreshToken,
    cardNumber: null,
    cardType: "silver"
  }

  try {
    Promise.all([
      Users.create(userData),
      Customers.create(userData)
    ]).then(async () => {
      const getUser = await Customers.findByPk(id);

      res.status(200).json({
        accessToken: accessToken,
        refreshToken: refreshToken,
        user: new UserClass(getUser["dataValues"]),
      });
    });
  } catch (error) {
    console.log(error);
  }
});

/**
 * Login
 * ---------------------------------------------------------------------------------------------
 * Pseudocode
 *
 * 1. Login aplikasi { Web Core, Web Mitra, Mobile Driver, Mobile Customer }
 * 2. Parameter yang harus dibawa adalah { email, katasandi }
 * 3. Cek apakah email yang dimasukkan ada di database
 * 4. Jika tidak ada, kembalikan informasi bahwa user belum terdaftar / Email Tidak Ditemukan
 * 5. Jika ada, Cek apakah katasandi yang dimasukkan sama dengan katasandi yang ada didatabase user tersebut
 * 6. Jika tidak, kembalikan informasi 'Wrong Password'.
 * 7. Jika ada, buat token user (JWT). Token ini digunakan untuk mengakses fungsi, token di masukkan
 *    ke dalam Header dengan ke Authorization pada saat ingin mengakses fungsi lainnya.
 * 8. Perbarui user login, ini digunakan untuk melihat user tersebut pertama login dan terakhir login.
 *    Pembaruan ini untuk semua group { employee, customer, diver }
 * 9. Kirim token sebagai return ketika berhasil login.
 *
 * Pilihan:
 * Apakah ketika login harus mengecek bahwa no.tlp user tersebut sudah terverifikasi atau belum.
 */
router.post("/login", async (req, res) => {
  try {

    const user = await Users.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found !" });
    }

    if (
      user["dataValues"].disable === true ||
      user["dataValues"].disable === 1
    ) {
      return res.status(404).json({ message: "Unauthorized !" });
    }

    if (user["dataValues"].status === "non-active") {
      return res.status(404).json({ message: "Your account is deactivated !" });
    }

    const match = await bcrypt.compare(
      req.body.password,
      user["dataValues"].password
    );
    if (!match) return res.status(400).json({ message: "Wrong Password" });

    var _user = new UserClass(user["dataValues"]);

    var userId = _user.id,
      name = _user.fullName,
      email = _user.email;

    const accessToken = jwt.sign(
      { userId, name, email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );
    const refreshToken = jwt.sign(
      { userId, name, email },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    var userData = {
      id: userId,
      firstSignInAt: _user.firstSignInAt,
      lastSignInAt: new Date(),
      group: _user.group,
      refresh_token: refreshToken,
    };

    if (_user.firstSignInAt == null) {
      userData.firstSignInAt = new Date();
    }

    const role = await Roles.findOne({
      where: {
        id: _user.role,
      },
    });

    const company = await Companies.findOne({
      where: {
        id: _user.companyId,
      },
    });

    // Update User
    UpdateUser(userData)
      .then(() => {
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        });

        res.json({
          accessToken: accessToken,
          user: _user,
          refreshToken: refreshToken,
          role: role ? new RoleClass(role["dataValues"]) : null,
          company: company ? new CompanyClass(company["dataValues"]) : null,
        });
      })
      .catch((error) => {
        console.log("Login Error :", error);
        res.status(400).json({ message: "Login failed !" });
      });
  } catch (error) {
    console.log("Error Login:", error);
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
});

router.post("/change-password", async (req, res) => {
  const { oldPassword, newPassword, confirmNewPassword, id } = req.body;

  try {

    let user = await Users.findByPk(id);
    if (!user) {
      return res.status(400).json({ message: 'not found !' })
    }

    const match = await bcrypt.compare(
      oldPassword,
      user["dataValues"].password
    );
    if (!match) return res.status(400).json({ message: "old password is not the same" });

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(newPassword, salt);

    let userData = {
      id: user["dataValues"].id,
      group: user["dataValues"].group,
      password: hashPassword
    }

    UpdateUser(userData).then(() => {
      res.status(200).json({ message: 'successfully changed password' })
    }).catch((error) => {
      res.status(400).json({ message: 'Error ', error: error })
    })

  } catch (error) {
    res.status(400).json({ message: 'Error ', error: error })
  }
})

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {

    let user = await Users.findOne({
      where: {
        email: email
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'email belum terdaftar !' })
    }

    let newPassword = randomNumbersLettersForPassword(10);

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(newPassword, salt);

    let userData = {
      id: user["dataValues"].id,
      group: user["dataValues"].group,
      password: hashPassword
    }

    UpdateUser(userData).then(() => {
      res.status(200).json({ message: 'successfully changed password' })
    }).catch((error) => {
      res.status(400).json({ message: 'Error ', error: error })
    })

  } catch (error) {
    console.log(error)
    res.status(409).json({ message: 'Error ', error: error })
  }
})

router.post("/reset-password/:id", async (req, res) => {
  const { id } = req.params;

  try {

    let user = await Users.findByPk(id);
    if (!user) {
      return res.status(400).json({ message: 'not found !' })
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash('pass@12345', salt);

    let userData = {
      id: user["dataValues"].id,
      group: user["dataValues"].group,
      password: hashPassword
    }

    UpdateUser(userData).then(() => {
      res.status(200).json({ message: 'successfully reset password' })
    }).catch((error) => {
      res.status(400).json({ message: 'Error ', error: error })
    })

  } catch (error) {
    res.status(400).json({ message: 'Error ', error: error })
  }
})

/**
 * Logout
 * -----------------------------------------------------------------------------------------
 */
router.post("/logout", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const user = await Users.findAll({
    where: {
      refresh_token: refreshToken,
    },
    attributes: ["id"],
  });
  if (!user[0]) return res.sendStatus(204);
  const userId = user[0].id;
  switch (user[0]["group"]) {
    case "employee":
      Promise.all([
        await Users.update(
          { refresh_token: null },
          {
            where: {
              id: userId,
            },
          }
        ),
        await Employees.update(
          { refresh_token: null },
          {
            where: {
              id: userId,
            },
          }
        ),
      ]);
      break;
    case "customer":
      Promise.all([
        await Users.update(
          { refresh_token: null },
          {
            where: {
              id: userId,
            },
          }
        ),
        await Customers.update(
          { refresh_token: null },
          {
            where: {
              id: userId,
            },
          }
        ),
      ]);
      break;
    case "driver":
      Promise.all([
        await Drivers.update(
          { refresh_token: null },
          {
            where: {
              id: userId,
            },
          }
        ),
        await Employees.update(
          { refresh_token: null },
          {
            where: {
              id: userId,
            },
          }
        ),
      ]);
      break;

    default:
      break;
  }
  res.clearCookie("refreshToken");
  return res.sendStatus(200);
});

router.put('/disable/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'Id user not found !' })
  }

  const user = await Users.findOne({
    where: {
      id: id
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found !" });
  }

  let _user = new UserClass(user["dataValues"]);

  var userData = {
    id: id,
    group: _user.group,
    disable: true
  };

  // Update User
  UpdateUser(userData)
    .then(() => {
      res.status(200).json({ message: 'Success !' });
    })
    .catch((error) => {
      console.log("Error :", error);
      res.status(400).json({ message: "Error !", error: error });
    });
})

router.put('/enable/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'Id user not found !' })
  }

  const user = await Users.findOne({
    where: {
      id: id
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found !" });
  }

  let _user = new UserClass(user["dataValues"]);

  var userData = {
    id: id,
    group: _user.group,
    disable: false
  };

  // Update User
  UpdateUser(userData)
    .then(() => {
      res.status(200).json({ message: 'Success !' });
    })
    .catch((error) => {
      console.log("Error :", error);
      res.status(400).json({ message: "Error !", error: error });
    });
})

module.exports = router;
