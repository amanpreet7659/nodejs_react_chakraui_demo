import { Box, Button, FormControl, FormLabel, Input, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import api from '../services/api'

const Edit_Form = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState({})

  useEffect(() => {
    api.get(`user/${id}`)
      .then(({ data }) => {
        setUser(data)
      })
      .catch(err => {
        console.log(err);
      })
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setUser({ ...user, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    api.patch(`user/${user._id}`, user)
      .then(response => {
        navigate('/user/list', { replace: true })
      })
      .catch(err => {
        console.log("error", JSON.stringify(err));
      })
  }

  return (
    <Box>
      <FormControl onSubmit={(e) => {
        e.preventDefault()
        // handleSubmit()
      }}>
        <FormLabel>First name</FormLabel>
        <Input
          className="form-control"
          id="firstName"
          onChange={handleChange}
          name="firstName"
          type="text"
          placeholder="first name"
          value={user?.firstName}
        />
        <FormLabel>Middle name</FormLabel>
        <Input
          className="form-control"
          onChange={handleChange}
          name="middelName"
          id="middelName"
          type="text"
          placeholder="middle name"
          value={user?.middelName}
        />
        <FormLabel>Last name</FormLabel>
        <Input
          className="form-control"
          onChange={handleChange}
          name="lastName"
          id="lastName"
          type="text"
          value={user?.lastName}
          placeholder="last name"
        />

        <FormLabel>Email address</FormLabel>
        <Input
          className="form-control"
          onChange={handleChange}
          name="email"
          id="email"
          type="email"
          value={user?.email}
          placeholder="Enter email"
        />
        <Text className="text-muted">
          We'll never share your email with anyone else.
        </Text>

        <FormLabel>Phone number</FormLabel>
        <Input
          className="form-control"
          onChange={handleChange}
          name="phoneNumber"
          id="phoneNumber"
          type="tel"
          placeholder="phone number"
          minLength={10}
          value={user?.phoneNumber}
          maxLength={10}
        />
        <FormLabel>User image</FormLabel>
        <input
          type="file"
          className="m-auto mt-2 form-control"
          accept=".jpeg,.png,.svg"
          name="image_url"
          onChange={async e => {
            const { name, value } = e.target
            try {
              if (e.target.files[0]) {
                const payload = new FormData();
                payload.append("file", e.target.files[0]);
                const { data: { path } } = await api.post(
                  "/image",
                  payload
                );
                const imagePath = api.image(path).toString();
                setUser({ ...user, [name]: imagePath })
              }
            } catch (e) {
              console.log("error ", JSON.stringify(e));
            }
          }}
        />
        <FormLabel>Date of birth</FormLabel>
        <Input
          className="form-control"
          onChange={handleChange}
          name="dateOfBirth"
          id="dateOfBirth"
          type="date"
          value={user?.dateOfBirth}
          placeholder="Date of birth"
        />
        <Button variant="outline" mt={4} colorScheme="teal" onClick={handleSubmit}>
          Submit
        </Button>
      </FormControl>
    </Box>
  )
}

export default Edit_Form