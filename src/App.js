import React from "react";
import Crud_Form from "./Pages/crud_form";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Create_Form from "./Pages/create_form";
import Navbar from "./Pages/Navbar";
import { Container } from "@chakra-ui/react";
import View_User from "./Pages/view_user";
import Edit_Form from "./Pages/edit_form";

const App = () => {
  return (
    <Router>
      <Container
        maxW="container.lg"
        border="1px"
        borderColor="#9A00002d"
        borderRadius={6}
        p="10px 10px"
      >
        <Navbar />
        <Routes>
          <Route element={<Create_Form />} path="/" />
          <Route element={<Crud_Form />} path="/user/list" />
          <Route element={<View_User />} path="/user/:id" />
          <Route element={<Edit_Form />} path="/user/edit/:id" />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
