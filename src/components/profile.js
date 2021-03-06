import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { storage } from "../firebase";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import CardProfilePost from "../Card/CardProfilePost";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useParams } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "transparent",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "left",
  color: theme.palette.text.secondary,
  boxShadow: "none",
}));

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="#">
        PHOTOGRAPHY
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function Profile() {
  const [myPost, setMyPost] = useState({});
  const [isDeleted, setIsDeleted] = useState(false);
  const { user } = useUserAuth();
  const [userDetails, setUserDetails] = useState();
  const [openDialog, setDialogOpen] = useState(false);
  const [firstNameRef, setFirstNameRef] = useState("");
  const [lastNameRef, setLastNameRef] = useState("");
  const [neckNameRef, setNeckNameRef] = useState("");
  const [dialogProf, setDialogProf] = useState(false);
  const [tagLineRef, setTagLineRef] = useState("");
  const [snackBarColor, setSnackBarColor] = useState("success")
  const [snackBarText, setSnackBarText] = useState("")
  let { userID } = useParams();

  const handleDialogOpen = () => {
    setDialogOpen(true);
    setFirstNameRef(userDetails.firstName);
    setLastNameRef(userDetails.lastName);
    setNeckNameRef(userDetails.neckName);
    setTagLineRef(userDetails.tagLine);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const userRef = doc(db, "users", userID);
    await updateDoc(userRef, {
      firstName: data.get("firstName"),
      lastName: data.get("lastName"),
      neckName: data.get("neckName"),
      tagLine: data.get("tagLine"),
    });
    const getUser = async () => {
      const docRef = doc(db, "users", `${userID}`);
      const data = await getDoc(docRef);
      setUserDetails(data.data());
    };
    getUser();
    handleDialogClose();
  };

  useEffect(() => {
    const getUserPost = async () => {
      const q = query(
        collection(db, "CollectionPost"),
        where("userID", "==", userID)
      );

      const data = await getDocs(q);
      setMyPost(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    userID && getUserPost();
    console.log("effect");
  }, [userID, isDeleted]);

  useEffect(() => {
    const getUser = async () => {
      const docRef = doc(db, "users", `${userID}`);
      const data = await getDoc(docRef);
      setUserDetails(data.data());
    };
    getUser();
  }, [userID]);

  const deletePost = (id) => {
    const postDoc = doc(db, "CollectionPost", id);
    deleteDoc(postDoc);
    setIsDeleted(!isDeleted);
    console.log("deleted");
  };

  const handleDialogProfOpen = () => {
    setDialogProf(true);
  };

  const handleDialogProfClose = () => {
    setDialogProf(false);
  };

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    uploadFile(e.target.files[0]);
  };

  const uploadFile = (file) => {
    if (!file) return;
    const storageRef = ref(storage, `/Images/${user.uid}/profile/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_change",
      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        // setProgress(prog);
        console.log(prog);
      },
      (err) => console.log("Error:", err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          const userRef = doc(db, "users", userID);
          updateDoc(userRef, {
            profileURL: url,
            fileName: file.name,
          });
          console.log(url);
          handleDialogProfClose();
          setSnackBarColor("success");
          setSnackBarText("Change profile photo success!");
          handleAlertOpen();
        });
      }
    );
  };

  const deleteProfileFile = () => {
    // Create a reference to the file to delete
    const desertRef = ref(storage, `/Images/${user.uid}/profile/${userDetails.fileName}`);
    // Delete the file
    deleteObject(desertRef)
      .then(() => {
        console.log("File deleted successfully");
        const userRef = doc(db, "users", userID);
          updateDoc(userRef, {
            profileURL: "",
            fileName: "",
          });
          handleDialogProfClose();
          setSnackBarColor("success");
          setSnackBarText("File deleted successfully!");
          handleAlertOpen();
      })
      .catch((error) => {
        handleDialogProfClose();
        setSnackBarColor("error");
        setSnackBarText("Uh-oh, an error occurred!");
        handleAlertOpen();
      });
  };

  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertOpen = () => {
    setOpenAlert(true);
  };

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert(false);
  };

  return (
    <>
      <Box sx={{ height: "90vh", overflow: "auto" }}>
        <Box sx={{ flexGrow: 1, mt: 2 }}>
          <Grid container spacing={0} sx={{ mb: 2 }}>
            <Grid item xs={6} md={4}>
              <Item
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Item
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    borderRadius: "50%",
                    border: "5px solid #f50057",
                  }}
                >
                  <Avatar
                    sx={{ width: 150, height: 150, cursor: "pointer" }}
                    src={userDetails && userDetails.profileURL}
                    onClick={handleDialogProfOpen}
                  />
                </Item>
              </Item>
            </Grid>
            <Grid item xs={6} md={8}>
              <Item>
                <Stack spacing={0.5}>
                  <Item sx={{ p: 0, mt: 2 }}>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell
                            padding={"none"}
                            sx={{ borderBottom: "none", width: 230 }}
                          >
                            <Typography variant="h5" component="span">
                              {userDetails &&
                                userDetails.firstName.charAt(0).toUpperCase() +
                                  userDetails.firstName.slice(1) +
                                  " " +
                                  userDetails.lastName.charAt(0).toUpperCase() +
                                  userDetails.lastName.slice(1)}
                            </Typography>
                          </TableCell>
                          <TableCell
                            align="left"
                            padding={"none"}
                            sx={{ borderBottom: "none" }}
                          >
                            {userID === user.uid && (
                              <Button
                                variant="outlined"
                                size="small"
                                color="info"
                                onClick={handleDialogOpen}
                              >
                                Edit Profile
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Item>
                  <Item sx={{ p: 0 }}>
                    <Typography variant="body1" sx={{ color: "black" }}>
                      {myPost.length > 1
                        ? myPost.length + " posts"
                        : myPost.length + " post"}
                    </Typography>
                  </Item>
                  <Item sx={{ p: 0 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: "black",
                        fontStyle: "italic",
                        fontWeight: "600",
                      }}
                    >
                      @{userDetails && userDetails.neckName}
                    </Typography>
                    <Typography
                      variant="overline"
                      display="block"
                      gutterBottom
                      sx={{ lineHeight: "1" }}
                    >
                      {userDetails ? userDetails.tagLine : "loading..."}
                    </Typography>
                  </Item>
                </Stack>
              </Item>
            </Grid>
          </Grid>
          <Divider variant="fullWidth" />
          <Box sx={{ flexGrow: 1, mt: 3 }}>
            <Grid container spacing={4}>
              {myPost &&
                (Object.keys(myPost).length > 0 ? (
                  myPost.map((post) => {
                    return (
                      <CardProfilePost
                        post={post}
                        key={post.id}
                        handleDelete={deletePost}
                        user={user}
                      />
                    );
                  })
                ) : (
                  <Box sx={{ mt: 2, textAlign: "center" }}>
                    <Typography>"No Data Available!"</Typography>
                  </Box>
                ))}
            </Grid>
          </Box>
        </Box>
        <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
          <Copyright />
        </Container>
      </Box>
      <Dialog
        fullWidth={true}
        maxWidth={"xs"}
        open={openDialog}
        onClose={handleDialogClose}
      >
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <DialogContentText></DialogContentText>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  value={firstNameRef}
                  onChange={(e) => {
                    setFirstNameRef(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  value={lastNameRef}
                  onChange={(e) => {
                    setLastNameRef(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="neckName"
                  label="Neck Name"
                  name="neckName"
                  autoComplete="neck-name"
                  value={neckNameRef}
                  onChange={(e) => {
                    setNeckNameRef(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="tagLine"
                  label="Tag Line"
                  id="tagLine"
                  autoComplete="tag-line"
                  value={tagLineRef}
                  onChange={(e) => {
                    setTagLineRef(e.target.value);
                  }}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Save Changes
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
      <Dialog
        open={dialogProf}
        onClose={handleDialogProfClose}
        sx={{ textAlign: "center" }}
      >
        <DialogTitle>Change profile photo</DialogTitle>
        <DialogContent dividers sx={{ p: 1.5 }}>
          <DialogContentText sx={{ minWidth: 360, color: "blue" }}>
            <Button variant="text" component="label" color="primary">
              {" "}
              Upload Photo
              <input type="file" hidden onChange={onSelectFile} />
            </Button>
          </DialogContentText>
        </DialogContent>
        <DialogContent sx={{ p: 1.5 }}>
          <DialogContentText sx={{ minWidth: 360, color: "red" }}>
            <Button variant="text" color="error" onClick={deleteProfileFile}>
              Remove current photo
            </Button>
          </DialogContentText>
        </DialogContent>
        <DialogContent dividers sx={{ p: 1.5 }}>
          <DialogContentText sx={{ minWidth: 360 }}>
            <Button onClick={handleDialogProfClose} sx={{ color: "black" }}>
              Cancel
            </Button>
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Snackbar
        open={openAlert}
        autoHideDuration={3000}
        onClose={handleAlertClose}
      >
        <Alert
          onClose={handleAlertClose}
          severity={snackBarColor}
          sx={{ width: "100%" }}
        >
          {snackBarText}
        </Alert>
      </Snackbar>
    </>
  );
}
