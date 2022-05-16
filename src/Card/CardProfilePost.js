import React, {useState, useEffect} from "react";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import IconButton from "@mui/material/IconButton";
import CommentIcon from "@mui/icons-material/Comment";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import {
    collection,
    onSnapshot,
    query,
    orderBy,
  } from "firebase/firestore";
  import { db } from "../firebase";


const CardItem = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "left",
  color: theme.palette.text.secondary,
  height: "285px",
  boxShadow: "none",
  borderRadius: "0px",
}));

export default function CardProfilePost(props) {
  const { post } = props;
  const [comments, setComments] = useState({});

  useEffect(() => {
    async function getAllComments() {
      const postDocComments = collection(
        db,
        `CollectionPost/${post.id}/comments`
      );
      const q = query(postDocComments, orderBy("createdAt", "desc"));
      onSnapshot(q, (snapshot) => {
        setComments(
          snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
      });
    }
    getAllComments();
  }, [post.id]);
  
  return (
    <Grid item xs={6} md={4}>
      <CardItem sx={{ padding: 0 }}>
        <ImageListItem sx={{ height: "285px !important" }}>
          <img
            src={`${post.imageURL}?w=164&h=285&fit=crop&auto=format`}
            srcSet={`${post.imageURL}?w=164&h=285&fit=crop&auto=format&dpr=2 2x`}
            alt={"img"}
            loading="lazy"
          />
          <ImageListItemBar sx={{height: "45px", pl:0}}
            title={
              <>
                <IconButton
                  sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                  aria-label={`heart`}
                >
                  <FavoriteIcon />
                  <Typography sx={{ fontSize: "13px", ml: 1 }}>
                    {post.reactions.length}
                  </Typography>
                </IconButton>
                <IconButton
                  sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                  aria-label={`comment`}
                >
                  <CommentIcon />
                  <Typography sx={{ fontSize: "13px", ml: 1 }}>
                    {comments.length}
                  </Typography>
                </IconButton>
              </>
            }
          />
        </ImageListItem>
      </CardItem>
    </Grid>
  );
}
