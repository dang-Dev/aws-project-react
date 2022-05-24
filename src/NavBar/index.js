import React, { useState, useEffect } from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircle from "@mui/icons-material/AccountCircle";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import MoreIcon from "@mui/icons-material/MoreVert";
import LocalSeeIcon from "@mui/icons-material/LocalSee";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { useUserAuth } from "../context/UserAuthContext";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CloseIcon from "@mui/icons-material/Close";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Logout from "@mui/icons-material/Logout";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import ButtonGroup from "@mui/material/ButtonGroup";
import { storage } from "../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import LinearProgress from "@mui/material/LinearProgress";
import { addDoc, serverTimestamp, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useHistory } from "react-router-dom";
import Container from "@mui/material/Container";
import Autocomplete from "@mui/material/Autocomplete";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(1),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "5px",
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
  border: "1px solid #cfd8dc",
}));

// const SearchIconWrapper = styled("div")(({ theme }) => ({
//   padding: theme.spacing(0, 2),
//   height: "100%",
//   position: "absolute",
//   pointerEvents: "none",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
// }));

// const StyledInputBase = styled(InputBase)(({ theme }) => ({
//   color: "inherit",
//   "& .MuiInputBase-input": {
//     padding: theme.spacing(1, 1, 1, 0),
//     // vertical padding + font size from searchIcon
//     paddingLeft: `calc(1em + ${theme.spacing(4)})`,
//     transition: theme.transitions.create("width"),
//     width: "100%",
//     [theme.breakpoints.up("md")]: {
//       width: "25ch",
//     },
//   },
// }));

export default function PrimarySearchAppBar() {
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [progress, setProgress] = useState(0);
  const [description, setDescription] = useState();
  const history = useHistory();

  const [openAPICall, setOpenAPICall] = useState(false);
  const [options, setOptions] = useState([]);
  const loading = openAPICall && options.length === 0;

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      const data = await getDocs(collection(db, "users"));

      if (active) {
        setOptions(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      }
    })();
    
    return () => {
      active = false;
    };
  }, [loading]);
  
  useEffect(() => {
    if (!openAPICall) {
      setOptions([]);
    }
  }, [openAPICall]);

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }
    setSelectedFile(e.target.files[0]);
  };

  const { user, logOut } = useUserAuth();

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setSelectedFile("");
    setDescription("");
    setOpen(false);
  };

  const handleDescription = (e) => {
    setDescription(e.target.value);
  };

  const handleOnCreatePost = () => {
    uploadFile(selectedFile);
  };

  const uploadFile = (file) => {
    if (!file) return;
    const storageRef = ref(storage, `/Images/${user.uid}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_change",
      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(prog);
      },
      (err) => console.log("Error:", err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          addDoc(collection(db, "CollectionPost"), {
            userID: user.uid,
            description: description,
            imageURL: url,
            comments: {},
            reactions: [],
            createdAt: serverTimestamp(),
          });
          console.log(url);
          setProgress(0);
          handleClose();
        });
      }
    );
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const anchOpen = Boolean(anchorEl);

  const handleAnch1Close = () => {
    setAnchorEl(null);
  };

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleLogOut = async () => {
    try {
      await logOut();
    } catch (err) {
      console.log(err.message);
    }
  };
  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      id={menuId}
      open={anchOpen}
      onClose={handleAnch1Close}
      onClick={handleAnch1Close}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: "visible",
          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
          mt: 1.5,
          width: 200,
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
            right: 14,
            width: 10,
            height: 10,
            bgcolor: "background.paper",
            transform: "translateY(-50%) rotate(45deg)",
            zIndex: 0,
          },
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <MenuItem
        onClick={() => {
          history.push(`/${user.uid}/profile`);
        }}
      >
        <Avatar /> Profile
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleLogOut}>
        <ListItemIcon>
          <Logout fontSize="small" />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={5} color="error">
            <HomeIcon />
          </Badge>
        </IconButton>
        <p>Home</p>
      </MenuItem>
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <SendOutlinedIcon sx={{ transform: "rotate(320deg)" }} />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <AddBoxOutlinedIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="static"
          sx={{
            background: "white",
            boxShadow: "none",
            color: "black",
            borderBottom: "1px solid #cfd8dc",
          }}
        >
          <Container fixed sx={{ width: "76%" }}>
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="open drawer"
                sx={{ mr: 0 }}
              >
                <LocalSeeIcon />
              </IconButton>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ display: { xs: "block", sm: "block" }, mr: 10 }}
              >
                PHOTOGRAPHY
              </Typography>
              <Search
                sx={{ display: { xs: "none", sm: "block" }}}
              >
                {/* <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper> */}
                <Autocomplete
                  id="asynchronous-demo"
                  sx={{ width: 280}}
                  open={openAPICall}
                  onOpen={() => {
                    setOpenAPICall(true);
                  }}
                  onClose={() => {
                    setOpenAPICall(false);
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option.firstName === value.firstName
                  }
                  getOptionLabel={(option) => option.firstName + " " + option.lastName}
                  options={options}
                  loading={loading}
                  autoHighlight={true}
                  onChange={(event, newValue)=>{ newValue && history.push(`/${newValue.id}/profile`)}}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size={"small"}
                      placeholder={"Search..."}
                      InputProps={{
                        ...params.InputProps,
                      }}
                    />
                  )}
                />
              </Search>
              <Box sx={{ flexGrow: 1 }} />
              <Box sx={{ display: { xs: "none", md: "flex" } }}>
                <IconButton
                  size="large"
                  aria-label="home"
                  color="inherit"
                  onClick={() => {
                    history.push("/");
                  }}
                >
                  <HomeIcon />
                </IconButton>
                <IconButton
                  size="large"
                  aria-label="add post"
                  color="inherit"
                  onClick={handleClickOpen}
                >
                  {/* <Badge badgeContent={17} color="error"> */}
                  <AddBoxOutlinedIcon />
                  {/* </Badge> */}
                </IconButton>
                <Tooltip title="Account settings">
                  <IconButton
                    onClick={handleClick}
                    size="small"
                    aria-controls={open ? { menuId } : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                  >
                    <Avatar sx={{ width: 32, height: 32 }}>A</Avatar>
                  </IconButton>
                </Tooltip>
              </Box>
              <Box sx={{ display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-label="show more"
                  aria-controls={mobileMenuId}
                  aria-haspopup="true"
                  onClick={handleMobileMenuOpen}
                  color="inherit"
                >
                  <MoreIcon />
                </IconButton>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
      </Box>
      <BootstrapDialog
        // onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth={"xs"}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          Create New Post
        </BootstrapDialogTitle>
        <DialogContent dividers>
          {progress !== 0 ? (
            <Box sx={{ width: "100%", mb: 1 }}>
              <LinearProgress variant="determinate" value={progress} />
            </Box>
          ) : (
            ""
          )}
          <Box
            sx={{
              p: 1,
              border: "2px dashed grey",
              borderRadius: "4px",
              width: 350,
              height: 220,
              maxHeight: 220,
              maxWidth: 350,
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
            }}
          >
            {selectedFile ? (
              <img
                src={preview}
                alt="preview"
                width={345}
                height={215}
                style={{ borderRadius: "4px" }}
              />
            ) : (
              <Button variant="outlined" component="label" color="primary">
                {" "}
                <AddIcon /> Upload Image
                <input type="file" hidden onChange={onSelectFile} />
              </Button>
            )}
          </Box>
          <Box sx={{ mt: 1 }}>
            {selectedFile && (
              <Box sx={{}}>
                <ButtonGroup
                  size="small"
                  aria-label="small button group"
                  fullWidth={true}
                >
                  <Button variant="outlined" component="label" >
                    {" "}
                    Change a file
                    <input type="file" hidden onChange={onSelectFile} />
                  </Button>
                  <Button
                    variant="outlined"
                    component="label"
                    color="error"
                    onClick={() => {
                      setSelectedFile("");
                    }}
                  >
                    Remove a file
                  </Button>
                </ButtonGroup>
              </Box>
            )}
          </Box>
          <TextField
            id="standard-textarea"
            label="Say something here..."
            placeholder="What's on you're mind"
            multiline
            variant="standard"
            fullWidth={true}
            value={description}
            onChange={handleDescription}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            color="primary"
            variant="outlined"
            autoFocus
            onClick={handleOnCreatePost}
          >
            Create Post
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
