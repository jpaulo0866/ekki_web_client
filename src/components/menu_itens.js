import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import { NavLink } from 'react-router-dom';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CreditCard from '@material-ui/icons/CreditCard';
import Home from '@material-ui/icons/Home';
import Contacts from '@material-ui/icons/Contacts';
import TransferWithinAStation from '@material-ui/icons/TransferWithinAStation';
import LockOutlined from '@material-ui/icons/LockOutlined';

export const mainListItems = (
  <div>
    <NavLink to="/home" style={{ textDecoration: "none" }} >
      <ListItem button>
        <ListItemIcon >
          <Home />
        </ListItemIcon>
        <ListItemText primary="Home" />
      </ListItem>
    </NavLink>
    <NavLink to="/creditcards" style={{ textDecoration: "none" }}>
      <ListItem button>
        <ListItemIcon>
          <CreditCard />
        </ListItemIcon>
        <ListItemText primary="Meus Cartões" />
      </ListItem>
    </NavLink>
    <NavLink to="/contacts" style={{ textDecoration: "none" }}>
      <ListItem button>
        <ListItemIcon>
          <Contacts />
        </ListItemIcon>
        <ListItemText primary="Contatos" />
      </ListItem>
    </NavLink>
    <NavLink to="/transfers" style={{ textDecoration: "none" }}>
      <ListItem button>
        <ListItemIcon>
          <TransferWithinAStation />
        </ListItemIcon>
        <ListItemText primary="Transferências" />
      </ListItem>
    </NavLink>
    <NavLink to="/changepass" style={{ textDecoration: "none" }}>
      <ListItem button>
        <ListItemIcon>
          <LockOutlined />
        </ListItemIcon>
        <ListItemText primary="Alterar Senha" />
      </ListItem>
    </NavLink>
  </div>
);