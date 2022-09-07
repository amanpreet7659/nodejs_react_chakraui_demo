import { Box, Flex, Link, Text } from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router'

const Navbar = () => {
    const navigate = useNavigate()

    const handleLinkClick = (path) => {
        navigate(path, { replace: true })
    }

    return (<Box>
        <Flex gap={4}>
            <Link onClick={() => { handleLinkClick('/') }} border="1px" borderColor="#9A00002d" p="0px 10px" borderRadius="6px">Create</Link>
            <Link onClick={() => { handleLinkClick("/user/list") }} border="1px" borderColor="#9A00002d" p="0px 10px" borderRadius="6px">List</Link>
        </Flex>
    </Box>)
}

export default Navbar