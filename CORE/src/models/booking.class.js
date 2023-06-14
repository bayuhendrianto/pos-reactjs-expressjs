import List from "./list.class";

class Booking {
  constructor(model) {
    model = model || {};
    this.id = model.id || null;
    this.no = model.no || null;
    this.companyId = model.companyId || null;
    this.companyName = model.companyName || null;
    this.companyEmail = model.companyEmail || null;
    this.companyPhone = model.companyPhone || null;
    this.companyPhotoUrl = model.companyPhotoUrl || null;

    this.customerId = model.customerId || null;
    this.customerFirstName = model.customerFirstName || null;
    this.customerLastName = model.customerLastName || null;
    this.customerName = model.customerName || null;
    this.customerEmail = model.customerEmail || null;
    this.customerPhone = model.customerPhone || null;
    this.customerPhoto = model.customerPhoto || "https://storage.dayanatura.com/assets/users/user.png";
    this.customerCardNumber = model.customerCardNumber || null;

    this.scheduleDetailId = model.scheduleDetailId || null;

    this.driverId = model.driverId || null;
    this.driverFirstName = model.driverFirstName || null;
    this.driverLastName = model.driverLastName || null;
    this.driverName = model.driverName || null;
    this.driverEmail = model.driverEmail || null;
    this.driverPhone = model.driverPhone || null;
    this.driverPhoto = model.driverPhoto || "https://storage.dayanatura.com/assets/users/user.png";
    this.driverCardNumber = model.driverCardNumber || null;

    this.vehicleId = model.vehicleId || null;
    this.vehicleRegistrationNumber = model.vehicleRegistrationNumber || null;
    this.vehicleBrand = model.vehicleBrand || null;
    this.vehicleLoadCapacity = model.vehicleLoadCapacity || null;
    this.vehicleLoadCapacityUsage = model.vehicleLoadCapacityUsage || null;
    this.vehicleLongDimention = model.vehicleLongDimention || null;
    this.vehicleLongDimentionUsage = model.vehicleLongDimentionUsage || null;
    this.vehicleWidthDimention = model.vehicleWidthDimention || null;
    this.vehicleWidthDimentionUsage = model.vehicleWidthDimentionUsage || null;
    this.vehicleHighDimention = model.vehicleHighDimention || null;
    this.vehicleHighDimentionUsage = model.vehicleHighDimentionUsage || null;
    this.vehicleLargeDimention = model.vehicleLargeDimention || null;
    this.vehicleLargeDimentionUsage = model.vehicleLargeDimentionUsage || null;
    this.vehiclePhoto = model.vehiclePhoto || null;
    this.vehicleType = model.vehicleType || null;
    this.vehicleCarWhellCategory = model.vehicleCarWhellCategory || null;
    this.vehicleItemCategory = model.vehicleItemCategory || null;
    this.vehicleBody = model.vehicleBody || null;

    this.orderFrom = model.orderFrom || null;
    this.orderFromLatitude = model.orderFromLatitude || null;
    this.orderFromLongitude = model.orderFromLongitude || null;
    this.orderDestination = model.orderDestination || null;
    this.orderDestinationLatitude = model.orderDestinationLatitude || null;
    this.orderDestinationLongitude = model.orderDestinationLongitude || null;
    this.orderPrice = model.orderPrice || null;
    this.orderInsuranceId = model.orderInsuranceId || null;
    this.orderInsuranceName = model.orderInsuranceName || null;
    this.orderPriceInsurance = model.orderPriceInsurance || null;
    this.orderPriceInsurancePercent = model.orderPriceInsurancePercent || null;
    this.totalOrderPrice = model.totalOrderPrice || null;
    this.discountOrderPrice = model.discountOrderPrice || null;
    this.totalOrderPriceAfterDiscount =
      model.totalOrderPriceAfterDiscount || null;
    this.orderPriceTax = model.orderPriceTax || null;
    this.totalOrderPriceWithTax = model.totalOrderPriceWithTax || null;
    this.statusItem = model.statusItem || "OTHERS";
    this.orderStatus = model.orderStatus || "NEW";
    this.orderCreateAt = model.orderCreateAt || null;
    this.orderAcceptAt = model.orderAcceptAt || null;
    this.orderPickAt = model.orderPickAt || null;
    this.orderStartAt = model.orderStartAt || null;
    this.orderFinishAt = model.orderFinishAt || null;
    this.orderDeliverAt = model.orderDeliverAt || null;
    this.orderCancelAt = model.orderCancelAt || null;
    this.orderCloseAt = model.orderCloseAt || null;
    this.isOrderAccept = model.isOrderAccept || false;
    this.isOrderPick = model.isOrderPick || false;
    this.isOrderStart = model.isOrderStart || false;
    this.isOrderFinish = model.isOrderFinish || false;
    this.isOrderDeliver = model.isOrderDeliver || false;
    this.isOrderCancel = model.isOrderCancel || false;
    this.isOrderClose = model.isOrderClose || false;
    this.totalItem = model.totalItem || null;
    this.notes = model.notes || null;

    this.paymentStatus = model.paymentStatus || "none";
    this.paymentWithSaldo = model.paymentWithSaldo || 0;
    this.paymentVaNumbers = model.paymentVaNumbers || null;
    this.paymentTransactionTime = model.paymentTransactionTime || null;
    this.paymentType = model.paymentType || null;
    this.paymentGatewayUrl = model.paymentGatewayUrl || null;
    this.paymentExpiry = model.paymentExpiry || null;
    this.paymentSettlementAt = model.paymentSettlementAt || null;

    this.autoAcceptedAt = model.autoAcceptedAt || null;
    this.autoClosedAt = model.autoClosedAt || null;

    this.pickupAddress = model.pickupAddress || null;
    this.pickupVillage = model.pickupVillage || null;
    this.pickupNeighbourhood = model.pickupNeighbourhood || null;
    this.pickupHamlet = model.pickupHamlet || null;
    this.pickupSubDistrict = model.pickupSubDistrict || null;
    this.pickupDistrict = model.pickupDistrict || null;
    this.pickupCity = model.pickupCity || null;
    this.pickupProvince = model.pickupProvince || null;
    this.pickupPostalCode = model.pickupPostalCode || null;
    this.pickupLat = model.pickupLat || null;
    this.pickupLng = model.pickupLng || null;

    this.deliveryAddress = model.deliveryAddress || null;
    this.deliveryVillage = model.deliveryVillage || null;
    this.deliveryNeighbourhood = model.deliveryNeighbourhood || null;
    this.deliveryHamlet = model.deliveryHamlet || null;
    this.deliverySubDistrict = model.deliverySubDistrict || null;
    this.deliveryDistrict = model.deliveryDistrict || null;
    this.deliveryCity = model.deliveryCity || null;
    this.deliveryProvince = model.deliveryProvince || null;
    this.deliveryPostalCode = model.deliveryPostalCode || null;
    this.deliveryLat = model.deliveryLat || null;
    this.deliveryLng = model.deliveryLng || null;
    this.invoiceNumber = model.invoiceNumber || null;

    this.createdBy = model.createdBy || null;
    this.updatedBy = model.updatedBy || null;
    this.createdAt = model.createdAt || null;
    this.updatedAt = model.updatedAt || null;
    this.deletedAt = model.deletedAt || null;

    this.recipientName = model.recipientName || null;
    this.recipientEmail = model.recipientEmail || null;
    this.recipientPhoneNumber = model.recipientPhoneNumber || null;
    this.sendEmailBookingCreated = model.sendEmailBookingCreated || false;

    this.departureDate = model.departureDate || null;
    this.departureTime = model.departureTime || null;
    this.arrivalDate = model.arrivalDate || null;
    this.arrivalTime = model.arrivalTime || null;

    this.scheduleStatus = model.scheduleStatus || 'SAVE';
    this.scheduleNotes = model.scheduleNotes || null;

    this.documents = model.documents || [];
  }
}

class BookingList extends List {
  get model() {
    return Booking;
  }
}

export { Booking, BookingList };
