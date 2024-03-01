import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

function Footer() {
    return (
        <Box
            sx={{
                backgroundColor: (theme) =>
                    theme.palette.mode === "light"
                        ? theme.palette.grey[200]
                        : theme.palette.grey[800],
                p: 1,
                position: 'fixed',
                bottom: 0,
                width: '100%',
                zIndex: 100
            }}
            component="footer"
        >
            <Container maxWidth="sm">
                <Typography variant="body2" color="text.secondary" align="center">
                    {"FireScope"}
                    {" "}
                    {new Date().getFullYear()}
                    {""}
                </Typography>
            </Container>
        </Box>
    );
}

export default Footer;