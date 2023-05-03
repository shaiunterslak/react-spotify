import { createStyles, Text, Tooltip } from '@mantine/core'
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { navbarItems } from '../../data/navbarItems';
import NavbarItem from './NavbarItem';
import { Download, ChevronsLeft, ChevronsRight } from 'tabler-icons-react';
import { motion } from 'framer-motion';
import { useNowPlayingContext } from '../../contexts/useNowPlaying';
import NowPlayingCover from '../NowPlaying/NowPlayingCover';
import { useMediaQuery } from '@mantine/hooks';
import { Breakpoint, maxWidth } from '../../utils/breakpoints';
import { useAppDispatch } from '../../store/hooks';
import { closeMenu } from '../../store/features/menu.slice';

const useStlyes = createStyles((theme, { isCollapsed }: { isCollapsed: boolean }) => ({
    wrapper: {
        width: isCollapsed ? '75px' : '226px',
        maxWidth: '226px',
        gridArea: 'nav-bar',
        backgroundColor: '#000',
        willChange: 'width',
        transition: 'width 350ms cubic-bezier(0.075, 0.82, 0.165, 1)'
    },
    logo: {
        'svg': {
            height: '40px',
            maxWidth: '131px',
            width: '100%'
        }
    },
    navbar: {
        [isCollapsed ? 'display' : '']: 'flex',
        [isCollapsed ? 'justifyContent' : '']: 'center'
    }
}));

const Navbar = () => {
    const router = useRouter();
    const sm = useMediaQuery(maxWidth(Breakpoint.sm));
    const dispatch = useAppDispatch();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { classes, cx } = useStlyes({ isCollapsed });
    const { isMinimized } = useNowPlayingContext();

    useEffect(() => {
        const closeMenuOnNavigate = () => dispatch(closeMenu());

        router.events.on('routeChangeStart', closeMenuOnNavigate);

        return () => router.events.off('routeChangeStart', closeMenuOnNavigate);
    }, []);

    const toggleNavbar = () => {
        setIsCollapsed(!isCollapsed);
    }

    const getItem = ({ url, supressLink, icon, title, onClick }: any) => (
        <>
            {!isCollapsed ? (
                <div onClick={onClick}>
                    <NavbarItem active={router.pathname === url && !supressLink}>
                        {icon}
                        <Text size="sm">{title}</Text>
                    </NavbarItem>
                </div>
            ) : (
                <Tooltip label={title} offset={32} position="right" withArrow>
                    <div onClick={onClick}>
                        <NavbarItem active={router.pathname === url}>
                            {icon}
                        </NavbarItem>
                    </div>
                </Tooltip>
            )}
        </>
    )

    const getSlicedItems = (start: number, end?: number) => (
        <>
            {navbarItems.slice(start, end).map((item, key) => (
                <div key={key}>
                    <Link href={item.url} passHref>
                        <a>
                            {getItem(item)}
                        </a>
                    </Link>
                </div>
            ))}
        </>
    )

    return (
        <div className={cx(classes.wrapper, 'flex flex-col h-full')}>
            <div className={cx(classes.logo, 'text-white m-6')}>
                <Link href="/" passHref>
                    <a>
                        {!isCollapsed ? (
                            <img src = '/assets/logo_magic.svg' alt = 'logo' />
                        ) : (
                            <img alt="Spotify" title="Spotify" width={27} height={27} className="invert h-full" src="/assets/logo_magic.png" />
                        )}
                    </a>
                </Link>
            </div>
            <nav className={cx(classes.navbar, 'flex-grow mx-6')}>
                <ul className="list-none">
                    {getSlicedItems(0, 3)}
                    <div className="mt-6">
                        {getSlicedItems(3)}
                    </div>
                </ul>
                <hr className="bg-[#282828] min-h-[1px] h-[1px] mt-2 border-0" />
            </nav>
            {!sm && (
                <>
                    <div className={cx({ 'flex flex-col justify-center': isCollapsed }, 'mx-6 my-3')}>
                        {getItem({
                            url: '',
                            title: 'Install app',
                            icon: <Download size={24} />
                        })}
                        {getItem({
                            url: '',
                            title: isCollapsed ? 'Expand' : 'Collapse',
                            icon: isCollapsed ? <ChevronsRight size={24} /> : <ChevronsLeft size={24} />,
                            onClick: toggleNavbar
                        })}
                    </div>
                    <motion.div className="overflow-hidden" variants={{ initial: { height: 'auto' }, minimize: { height: 0 } }} animate={!isMinimized ? 'initial' : 'minimize'}>
                        <NowPlayingCover key="bigNowPlaying" />
                    </motion.div>
                </>
            )}
        </div>
    )
}

export default Navbar