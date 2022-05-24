import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Card from "../Card/Card";
import AvatarCard from "../Avatar/Avatar";
import List from "@mui/material/List";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import {
  getDoc,
  doc,
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import { useUserAuth } from "../context/UserAuthContext";
import ListViewItem from "./ListViewItem";

function Copyright() {
  return (
    <>
      <Typography variant="body2" color="secondary" align="center">
        {"Copyright © "}
        <Link color="inherit" href="#">
          PHOTOGRAPHY
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center">
        {"AljohnVillacruel & IanAgapito"}
      </Typography>
    </>
  );
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#f5f5f5",
  ...theme.typography.body2,
  padding: theme.spacing(0),
  textAlign: "center",
  height: "90vh",
  overflow: "auto",
  borderRadius: "0px",
  boxShadow: "none",
  color: theme.palette.text.secondary,
}));

const ColItem = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(0),
  textAlign: "center",
  borderRadius: "0px",
  boxShadow: "none",
  color: theme.palette.text.secondary,
}));

const Home = () => {
  const { user } = useUserAuth();
  const [currentUserData, setCurrentUserData] = useState();
  const [collectionPost, setCollectionPost] = useState();
  const [reactions, setReactions] = useState();

  useEffect(() => {
    const getUser = async () => {
      const docRef = doc(db, "users", `${user.uid}`);
      const data = await getDoc(docRef);
      setCurrentUserData(data.data());
    };
    user && getUser();
  }, [user]);

  useEffect(() => {
    const q = query(
      collection(db, "CollectionPost"),
      orderBy("createdAt", "desc")
    );
    onSnapshot(q, (snapshot) => {
      setCollectionPost(
        snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    });
  }, []);

  useEffect(() => {
    setReactions(
      collectionPost &&
        Object.values(collectionPost).sort(
          (a, b) => b.reactions.length - a.reactions.length
        ).slice(0, 5)
    );
   
  }, [collectionPost]);

  console.log(reactions);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={1}>
        <Grid item xs={8}>
          <Item>
            {collectionPost &&
              (Object.keys(collectionPost).length > 0 ? (
                collectionPost.map((post) => {
                  return (
                    <Card
                      currentUser={currentUserData}
                      uid={user.uid}
                      collections={post}
                      key={post.id}
                    />
                  );
                })
              ) : (
                <Typography sx={{ mt: 2 }}>"No Data Available!"</Typography>
              ))}
          </Item>
        </Grid>
        <Grid item xs={4}>
          <Item>
            <Grid container rowSpacing={0} sx={{ mt: 2 }}>
              <Grid item xs={12}>
                <ColItem>
                  <AvatarCard
                    isInCommentCard={false}
                    neckName={
                      currentUserData ? currentUserData.neckName : "No Data!"
                    }
                    firstName={
                      currentUserData
                        ? currentUserData["firstName"].charAt(0).toUpperCase() +
                          currentUserData["firstName"].slice(1)
                        : "No data!"
                    }
                    lastName={
                      currentUserData
                        ? currentUserData["lastName"].charAt(0).toUpperCase() +
                          currentUserData["lastName"].slice(1)
                        : "No data!"
                    }
                  />
                </ColItem>
              </Grid>
              <Grid item xs={12}>
                <ColItem sx={{ textAlign: "left" }}>
                  <Typography
                    sx={{ ml: 1, mb: 0, fontWeight: "600" }}
                    variant="subtitle2"
                    display="block"
                    gutterBottom
                  >
                    Suggestions for you
                  </Typography>
                </ColItem>
              </Grid>
              <Grid item xs={12}>
                <ColItem>
                  <List dense={true}>
                    {reactions &&
                      (Object.keys(reactions).length > 0 ? (
                        reactions.map((react) => {
                          return react.userID !== user.uid && <ListViewItem key={react.id} react={react}/>
                  
                        })
                      ) : (
                        <Typography sx={{ mt: 2 }}>
                          "No Data Available!"
                        </Typography>
                      ))}
                  </List>
                </ColItem>
                <Box sx={{ m: 3 }}>
                  <Copyright />
                </Box>
              </Grid>
            </Grid>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
