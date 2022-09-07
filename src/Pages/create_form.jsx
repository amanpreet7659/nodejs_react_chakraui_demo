import { Box, Button, FormControl, FormLabel, Input, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import api from '../services/api'

const Create_Form = () => {
    const navigate = useNavigate()
    const [initialValues, setInitialValues] = useState({
        email: "",
        firstName: "",
        lastName: "",
        middelName: "",
        phoneNumber: "",
        dateOfBirth: "",
        image_url: "",
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setInitialValues({ ...initialValues, [name]: value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(initialValues);
        api.post(`user`, initialValues)
            .then(response => { navigate('/user/list', { replace: true }) })
            .catch(err => {
                console.log("error", err);
                alert(JSON.stringify(err.response.data))
            })
    }

    return (<Box>
        <FormControl onSubmit={(e) => {
            e.preventDefault()
            // handleSubmit()
        }}>
            <Text fontSize="16px" >Create User</Text>
            <FormLabel>First name</FormLabel>
            <Input
                className="form-control"
                id="firstName"
                onChange={handleChange}
                name="firstName"
                type="text"
                placeholder="first name"
            />
            <FormLabel>Middle name</FormLabel>
            <Input
                className="form-control"
                onChange={handleChange}
                name="middelName"
                id="middelName"
                type="text"
                placeholder="middle name"
            />
            <FormLabel>Last name</FormLabel>
            <Input
                className="form-control"
                onChange={handleChange}
                name="lastName"
                id="lastName"
                type="text"
                placeholder="last name"
            />

            <FormLabel>Email address</FormLabel>
            <Input
                className="form-control"
                onChange={handleChange}
                name="email"
                id="email"
                type="email"
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
                            setInitialValues({ ...initialValues, [name]: imagePath })
                            console.log(initialValues);
                        }
                    } catch (e) {
                        console.log("error ", e);
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
                placeholder="Date of birth"
            />
            <Button variant="outline" mt={4} colorScheme="teal" type="submit" onClick={handleSubmit}>
                Submit
            </Button>
        </FormControl>
    </Box>)
}

export default Create_Form