import '@mantine/core/styles.css';
import { Link } from "react-router-dom";
import { useState } from "react";
import React, { JSX } from "npm:@types/react";
import { Anchor, Box, Burger, Container, Group, useMantineTheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './header.module.css';
import { borderResolver } from "npm:@mantine/core@^7.16.1";


const links = [
    { 
        link: '/',
        label: 'Home'
    },
    { 
        link: '/schedule',
        label: 'Schedule'
    },
    { 
        link: '/programmes',
        label: 'Programmes'
    },
    { 
        link: '/selected',
        label: 'Selected'
    },
];

const header = {
    height: "2em",
    marginBottom: "0.5em",
    backgroundColor: "var(--mantine-color-body)",
    borderBottom: "1px solid light-dark(var(--mantine-color-gray-4), var(--mantine-color-dark-7))",
}

const Navbar = () => {
    const theme = useMantineTheme();
    const [opened, {toggle}] = useDisclosure(false);
    const [active, setActive] = useState(links[0].link);
    const items = links.map((link) => {
        return (
            <Anchor
                component={Link}
                to={link.link}
                key={link.label}
                className={classes.link}
                data-active={active === link.link || undefined}
                underline="never"
                onClick={(event) => {
                    // event.preventDefault();
                    setActive(link.link);
                }}
            >
                {link.label}
            </Anchor>
        );
    });
    return (
    <div style={{
        zIndex: "10",
        position: "fixed",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
    }}>
        <header style={header}>
            <Container size="md" className="classes.inner">
                <Group gap={5} visibleFrom="xs">
                    {items}
                </Group>

                <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
            </Container>
        </header>
    </div>);
};

export default Navbar;