import React from 'react';
import {
    CContainer,
    CHeader,
    CHeaderNav,
    CNavLink,
    CNavItem,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
} from '@coreui/react';
import { useEffect } from 'react';

import { useState } from 'react';
import i18next from "i18next";
import './header.scss';

const HeaderAuth = () => {
    const [title, setTitle] = useState(globalThis.localStorage.getItem('lng') || 'id')
    useEffect(() => {

    }, []);

    const changeLanguage = (value) => {
        setTitle(value)
        globalThis.localStorage.setItem('lng', value)
        i18next.changeLanguage(value)
    }

    return (
        <CHeader position="sticky" className="mb-4 transparent">
            <CContainer fluid>
                <CHeaderNav className="d-none d-md-flex me-auto">
                    <CNavItem>
                        <CNavLink></CNavLink>
                    </CNavItem>
                </CHeaderNav>
                <CHeaderNav>
                    <CDropdown >
                        <CDropdownToggle
                            style={{
                                background: '#00BBFF',
                                color: '#FFFFFF',
                                border: 'none'
                            }} size="sm">
                            {String(title).toUpperCase()}
                        </CDropdownToggle>
                        <CDropdownMenu>
                            <CDropdownItem onClick={() => changeLanguage('id')}>ID</CDropdownItem>
                            <CDropdownItem onClick={() => changeLanguage('en')}>EN</CDropdownItem>
                        </CDropdownMenu>
                    </CDropdown>
                </CHeaderNav>
            </CContainer>
        </CHeader>
    )
}

export default HeaderAuth
