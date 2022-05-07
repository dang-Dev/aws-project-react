import React, { useEffect, useState, useRef } from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Divider from "@mui/material/Divider";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CommentIcon from "@mui/icons-material/Comment";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";
import InputBase from "@mui/material/InputBase";
import Dialog from "@mui/material/Dialog";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import AvatarCard from "../Avatar/Avatar";
import CommentCard from "./CommentCard";

export default function ViewCard(props) {
  const { collections, currentUser, uid } = props;
  const [heartState, setHeartState] = useState(false);
  const [userComment, setUserComment] = useState();
  const [openDialog, setOpenDialog] = useState(false);
  const [comments, setComments] = useState();
  const commentInput = useRef(null);
  const popUpCommentInput = useRef(null);
  const newFormatDateTime = new Date(
    collections.createdAt && collections.createdAt.seconds * 1000
  );
  const collection_id = collections.id;
  const userReaction = collections.reactions;

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(0),
    textAlign: "center",
    borderRadius: "0px",
    height: "85vh",
    color: theme.palette.text.secondary,
  }));

  const ScrollItem = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(0),
    textAlign: "center",
    height: "50vh",
    overflow: "auto",
    borderRadius: "0px",
    boxShadow: "none",
    borderBottom: "1px solid #eceff1",
    color: theme.palette.text.secondary,
  }));

  const updateUserReact = async (post_id, my_id) => {
    const postDoc = doc(db, "CollectionPost", post_id);
    if (userReaction.indexOf(my_id) === -1) {
      const newFields = { reactions: arrayUnion(my_id) };
      await updateDoc(postDoc, newFields);
      setHeartState(true);
    } else {
      const newFields = { reactions: arrayRemove(my_id) };
      await updateDoc(postDoc, newFields);
      setHeartState(false);
    }
  };

  useEffect(() => {
    if (userReaction.indexOf(uid) !== -1) {
      setHeartState(true);
    }
  }, [userReaction, uid]);

  function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  }

  const handleComments = (e) => {
    setUserComment(e.target.value);
  };

  const handlePopCommentPost = async () => {
    const popComment = popUpCommentInput.current.value;
    if (popComment !== "") {
      const postDoc = collection(
        db,
        `CollectionPost/${collection_id}/comments`
      );
      const newFields = {
        userID: uid,
        comment: popComment,
        createdAt: serverTimestamp(),
      };
      await addDoc(postDoc, newFields);
      popUpCommentInput.current.value = "";
      const postDocComments = collection(
        db,
        `CollectionPost/${collection_id}/comments`
      );
      const q = query(postDocComments, orderBy("createdAt", "desc"));
      onSnapshot(q, (snapshot) => {
        setComments(
          snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
      });
    } else {
      console.log("No Comment");
    }
  };

  const handleCommentPost = async () => {
    const cardComment = commentInput.current.value;
    if (cardComment !== "") {
      const postDoc = collection(
        db,
        `CollectionPost/${collection_id}/comments`
      );
      const newFields = {
        userID: uid,
        comment: userComment,
        createdAt: serverTimestamp(),
      };
      await addDoc(postDoc, newFields);
      commentInput.current.value = "";
      const postDocComments = collection(
        db,
        `CollectionPost/${collection_id}/comments`
      );
      const q = query(postDocComments, orderBy("createdAt", "desc"));
      onSnapshot(q, (snapshot) => {
        setComments(
          snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
      });
    } else {
      console.log("No Comment");
    }
  };

  useEffect(() => {
    async function getAllComments() {
      const postDocComments = collection(
        db,
        `CollectionPost/${collection_id}/comments`
      );
      const q = query(postDocComments, orderBy("createdAt", "desc"));
      onSnapshot(q, (snapshot) => {
        setComments(
          snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
      });
    }
    getAllComments();
  }, [collection_id]);

  const handleClickOpen = () => {
    setUserComment("");
    commentInput.current.value = "";
    setOpenDialog(true);
  };

  const handleClose = () => {
    popUpCommentInput.current.value = "";
    setOpenDialog(false);
  };

  return (
    <>
      <Card
        sx={{ maxWidth: "100%", marginTop: 2, border: "1px solid #cfd8dc" }}
      >
        <CardHeader
          sx={{ textAlign: "left" }}
          avatar={
            currentUser ? (
              <Avatar
                {...stringAvatar(
                  currentUser.firstName + " " + currentUser.lastName
                )}
              />
            ) : (
              "No Avatar"
            )
          }
          action={
            <IconButton aria-label="settings">
              <MoreHorizIcon />
            </IconButton>
          }
          title={
            currentUser && currentUser.firstName + " " + currentUser.lastName
          }
          subheader={newFormatDateTime.toLocaleString()}
        />
        <CardMedia
          component="img"
          height="385"
          image={collections.imageURL}
          alt="Image"
        />
        <CardActions disableSpacing>
          <IconButton
            aria-label="add to favorites"
            onClick={() => {
              updateUserReact(collection_id, uid);
            }}
          >
            {heartState ? (
              <FavoriteIcon sx={{ color: "#ed4956" }} />
            ) : (
              <FavoriteBorderIcon />
            )}
          </IconButton>
          <IconButton aria-label="comment" onClick={handleClickOpen}>
            <CommentIcon />
          </IconButton>
        </CardActions>
        <CardContent sx={{ textAlign: "left", pt: 0 }}>
          <Typography sx={{ fontWeight: "600", fontSize: "14px" }}>
            {userReaction.length !== 0 &&
              (userReaction.length > 1
                ? userReaction.length + " likes"
                : userReaction.length + " like")}
          </Typography>
          <Typography
            sx={{ fontSize: "14px", color: "#bdbdbd", cursor: "pointer" }}
            onClick={handleClickOpen}
          >
            {comments && "View All " + comments.length + " comments"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <b>
              {currentUser &&
                currentUser.firstName + " " + currentUser.lastName}
            </b>{" "}
            {collections.description}
          </Typography>
        </CardContent>
        <Divider variant="fullWidth" />
        <CardActions sx={{}}>
          <Box sx={{ display: "flex", alignItems: "flex-end", width: "100%" }}>
            <AccountCircle sx={{ color: "action.active", mr: 1, my: 0.5 }} />
            <InputBase
              sx={{ ml: 0, flex: 1 }}
              placeholder="Add comment..."
              inputProps={{ "aria-label": "add comment" }}
              onChange={handleComments}
              inputRef={commentInput}
            />
            <IconButton
              color="primary"
              aria-label="directions"
              onClick={handleCommentPost}
            >
              <Typography>{"Post"}</Typography>
            </IconButton>
          </Box>
        </CardActions>
      </Card>
      <Dialog
        fullWidth={false}
        maxWidth={"lg"}
        open={openDialog}
        onClose={handleClose}
        PaperProps={{
          style: { borderRadius: 0 },
        }}
      >
        <Box sx={{ flexGrow: 1, borderRadius: 0 }}>
          <Grid container spacing={0}>
            <Grid item xs={6} md={7}>
              <Item>
                <Card sx={{ maxWidth: "100%", borderRadius: 0 }}>
                  <CardMedia
                    sx={{ borderRadius: "0px" }}
                    component="img"
                    height="559"
                    image={collections.imageURL}
                    alt="Image"
                  />
                </Card>
              </Item>
            </Grid>
            <Grid item xs={6} md={5}>
              <Item>
                <Box sx={{ borderBottom: "1px solid #eceff1" }}>
                  <AvatarCard
                    isNeckName={false}
                    firstName={currentUser ? currentUser.firstName : "No data!"}
                    lastName={currentUser ? currentUser.lastName : "No data!"}
                  />
                </Box>
                <Box sx={{ width: "100%" }}>
                  <ScrollItem>
                    {comments &&
                      (Object.keys(comments).length > 0 ? (
                        comments.map((comment) => {
                          return (
                            <CommentCard
                              firstName={
                                currentUser ? currentUser.firstName : "No data!"
                              }
                              lastName={
                                currentUser ? currentUser.lastName : "No data!"
                              }
                              commentUserID={comment.userID}
                              comment={comment.comment}
                              createdAt={comment.createdAt}
                              key={comment.id}
                            />
                          );
                        })
                      ) : (
                        <Typography sx={{ mt: 2 }}>
                          "No Data Available!"
                        </Typography>
                      ))}
                  </ScrollItem>
                  <CardActions disableSpacing sx={{ pb: 0 }}>
                    <IconButton
                      aria-label="add to favorites"
                      onClick={() => {
                        updateUserReact(collection_id, uid);
                      }}
                    >
                      {heartState ? (
                        <FavoriteIcon sx={{ color: "#ed4956" }} />
                      ) : (
                        <FavoriteBorderIcon />
                      )}
                    </IconButton>
                    <IconButton aria-label="share">
                      <CommentIcon />
                    </IconButton>
                  </CardActions>
                  <CardContent sx={{ textAlign: "left", pt: 0 }}>
                    <Typography sx={{ fontWeight: "600", fontSize: "14px" }}>
                      {userReaction.length !== 0 &&
                        (userReaction.length > 1
                          ? userReaction.length + " likes"
                          : userReaction.length + " like")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <b>
                        {currentUser &&
                          currentUser.firstName + " " + currentUser.lastName}
                      </b>{" "}
                      {collections.description}
                    </Typography>
                  </CardContent>
                  <Divider variant="fullWidth" />
                  <CardActions sx={{}}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-end",
                        width: "100%",
                      }}
                    >
                      <AccountCircle
                        sx={{ color: "action.active", mr: 1, my: 0.5 }}
                      />
                      <InputBase
                        sx={{ ml: 0, flex: 1 }}
                        placeholder="Add comment..."
                        inputProps={{ "aria-label": "add comment2" }}
                        inputRef={popUpCommentInput}
                      />
                      <IconButton
                        color="primary"
                        aria-label="post"
                        onClick={handlePopCommentPost}
                      >
                        <Typography>{"Post"}</Typography>
                      </IconButton>
                    </Box>
                  </CardActions>
                </Box>
              </Item>
            </Grid>
          </Grid>
        </Box>
      </Dialog>
    </>
  );
}
