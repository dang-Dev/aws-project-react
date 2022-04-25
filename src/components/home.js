import React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Card from '../Card/Card'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  height: "87vh",
  overflow: 'auto',
  color: theme.palette.text.secondary,
}));

const ColItem = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(0.5),
  textAlign: "center",
  height: "40vh",
  background: "green",
  color: theme.palette.text.secondary,
}));

const Home = () => {
  return (
      <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={1}>
        <Grid item xs={4}>
          <Item>
            <Grid container rowSpacing={1}>
              <Grid item xs={12}>
                <ColItem>For Upper items</ColItem>
              </Grid>
              <Grid item xs={12}>
                <ColItem>For Upper items</ColItem>
              </Grid>
            </Grid>
          </Item>
        </Grid>
        <Grid item xs={8}>
          <Item>
            <Card name="Ace" age={23} gender="Male" />
            <Card name="Ace" age={23} gender="Male" />

            <Card name="Ace" age={23} gender="Male" />
            <Card name="Ace" age={23} gender="Male" />
            <Card name="Ace" age={23} gender="Male" />
            <Card name="Ace" age={23} gender="Male" />
            <Card name="Ace" age={23} gender="Male" />
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
