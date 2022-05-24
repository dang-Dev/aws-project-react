import React, { useState, useEffect } from "react";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import IconButton from "@mui/material/IconButton";
import CommentIcon from "@mui/icons-material/Comment";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { collection, onSnapshot, query, orderBy} from "firebase/firestore";
import { db } from "../firebase";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import ListItemIcon from '@mui/material/ListItemIcon';

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
  const { post, handleDelete, user } = props;
  const [comments, setComments] = useState({});
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
    <>
      <Grid item xs={6} md={4}>
        <CardItem sx={{ padding: 0 }}>
          <ImageListItem sx={{ height: "285px !important" }}>
            <img
              src={`${post.imageURL}?w=164&h=285&fit=crop&auto=format`}
              srcSet={`${post.imageURL}?w=164&h=285&fit=crop&auto=format&dpr=2 2x`}
              alt={"img"}
              loading="lazy"
            />
            <ImageListItemBar
              sx={{ height: "45px", pl: 0 }}
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
              actionIcon={
                user &&  user.uid === post.userID ? <Tooltip title="Delete Post">
                <IconButton
                  onClick={handleClick}
                  size="small"
                  sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                  aria-controls={open ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                >
                  <MoreVertIcon />
                </IconButton>
              </Tooltip>: "" 
                
              }
            />
          </ImageListItem>
        </CardItem>
      </Grid>
      <Menu
        anchorEl={anchorEl}
        id="profile-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt:0,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 5,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(460%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "bottom" }}
        anchorOrigin={{ horizontal: "center", vertical: "top" }}
      >
        <MenuItem onClick={()=>{handleDelete(post.id)}}>
        <ListItemIcon>
            <DeleteIcon fontSize="small" /> 
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
    </>
  );
}
