import { Box, Flex, FormLabel, Image, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import api from '../services/api'
import moment from 'moment'

const View_User = () => {
    const { id } = useParams()
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

    return (
        <Box>{console.log(user)}
            <Flex><FormLabel>First name : </FormLabel><Text>{user?.firstName}</Text></Flex>
            <Flex><FormLabel>Middle name : </FormLabel><Text>{user?.middleName}</Text></Flex>
            <Flex><FormLabel>Last name : </FormLabel><Text>{user?.lastName}</Text></Flex>
            <Flex><FormLabel>Email : </FormLabel><Text>{user?.email}</Text></Flex>
            <Flex><FormLabel>Date of Birth : </FormLabel><Text>{moment(user?.dateOfBirth).format("DD-MMM-yyyy")}</Text></Flex>
            <Flex><FormLabel>User image : </FormLabel><Image w={20} h={20} src={user?.image_url} /></Flex>
            <Flex><FormLabel>Phone number : </FormLabel><Text>{user?.phoneNumber}</Text></Flex>
        </Box>
    )
}

export default View_User