import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Typography } from '@mui/material';


export default function  AvatarCard(props) {
  const {firstName, lastName, neckName, handleClose, isInCommentCard, profileURL} = props
  const fullName = String(firstName) + " " + String(lastName);
  console.log(profileURL)
  return (
        <>
        {isInCommentCard ? (
          <CardHeader sx={{ p:1.5, textAlign: "left", fontSize: "10px",  boxShadow: "none"}}
        avatar={
          <Avatar sx={{ width: 32, height: 32, border: "1px solid #f50057" }} src={profileURL} />
        }
        action={
          <IconButton aria-label="close" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        }
        title = {<Typography sx={{fontWeight: "550", fontSize: "14px"}}>{fullName}</Typography>}
        subheader={neckName ? neckName: ""}
      />
        ): (
          <CardHeader sx={{ p:1.5, textAlign: "left", fontSize: "10px",  boxShadow: "none"}}
        avatar={
          <Avatar sx={{ width: 32, height: 32, border: "1px solid #f50057" }} src={profileURL} />
        }
        title = {<Typography sx={{fontWeight: "550", fontSize: "14px"}}>{fullName}</Typography>}
        subheader={neckName ? neckName: ""}
      />
        )}
        </>
  );
}
