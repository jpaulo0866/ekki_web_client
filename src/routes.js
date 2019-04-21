import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./components/home";
import CreditCard from "./components/creditcard/creditcard";
import Contacts from "./components/contacts/contacts";
import Transfers from "./components/transfer/transfers";
import ChangeMyPass from "./components/security/change_my_pass";

const Routes = () => (
    <Switch>
      <Route path="/home" component={Home} />
      <Route path="/creditcards" component={CreditCard} />
      <Route path="/contacts" component={Contacts} />
      <Route path="/transfers" component={Transfers} />
      <Route path="/changepass" component={ChangeMyPass} />
      <Route path="/" component={() => <h1>Welcome</h1>} />
      <Route path="*" component={() => <h1>Page not Found</h1>} />
    </Switch>
);

export default Routes;