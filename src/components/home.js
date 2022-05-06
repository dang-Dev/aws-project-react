import React, {useEffect, useState} from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Card from "../Card/Card";
import AvatarCard from "../Avatar/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Link from "@mui/material/Link";
import Typography from '@mui/material/Typography';
import { getDoc, doc, collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

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
  const [user, setUser] = useState({});
  const [currentUserData, setCurrentUserData] = useState({});
  const [collectionPost, setCollectionPost] = useState();

  onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      setUser(currentUser);
    }
  });

  useEffect(() => {
    const getUser = async () => {
      const docRef = doc(db, "users", `${user.uid}`);
      const data = await getDoc(docRef);
      setCurrentUserData(data.data());
    }; 
    getUser();
  }, [user]);
  
  useEffect(() => {
    const q = query(collection(db, "CollectionPost"), orderBy("createdAt", "desc"));
    onSnapshot(q, (snapshot) => {
      setCollectionPost(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id})));
    });
    
  }, []);

  function generate(element) {
    return [0, 1, 2, 4, 5].map((value) =>
      React.cloneElement(element, {
        key: value,
      })
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={1}>
        <Grid item xs={8}>
          <Item>
            {collectionPost && (
              Object.keys(collectionPost).length > 0 ? (
                collectionPost.map((post) => {
                  return (
                    <Card  currentUser={currentUserData} uid={user.uid} collections={post} key={post.id} />
                  )
                })
              ): <Typography sx={{mt:2}}>"No Data Available!"</Typography>
            )}
          </Item>
        </Grid>
        <Grid item xs={4} sx={{mt:2}}>
          <Item>
            <Grid container rowSpacing={0}>
              <Grid item xs={12}  > 
                <ColItem>
                  <AvatarCard firstName={currentUserData ? currentUserData["firstName"] : "No data!"} lastName={currentUserData ? currentUserData["lastName"] : "No data!"} />
                </ColItem>
              </Grid>
              <Grid item xs={12}>
                <ColItem sx={{ textAlign: "left"}}>
                <Typography sx={{ ml: 1, mb: 0, fontWeight: "600"}} variant="subtitle2" display="block" gutterBottom>
                Suggestions for you
                </Typography>
                </ColItem>
              </Grid>
              <Grid item xs={12}>
                <ColItem>
                  <List dense={true}>
                    {generate(
                      <ListItem
                        secondaryAction={
                          <Link href="#" underline="none">
                            {"See All"}
                          </Link>
                        }
                      >
                        <ListItemAvatar>
                          <Avatar>A</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="Single-line item"
                          secondary="Secondary text"
                        />
                      </ListItem>
                    )}
                  </List>
                </ColItem>
              </Grid>
            </Grid>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
