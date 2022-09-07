import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
    Container,
    TableContainer,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Select,
    FormLabel,
    Box,
    Flex,
    Image,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
    Button,
    IconButton,
    Input,
    Spinner,
} from '@chakra-ui/react'
import { ChevronDownIcon, DragHandleIcon } from '@chakra-ui/icons'
import api from '../services/api'
import moment from 'moment'
import { useNavigate } from 'react-router'
import Pagination from './pagination/pagination'
import { AiOutlineCloudDownload, AiOutlineCloudUpload } from 'react-icons/ai'
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const fileExtension = ".xlsx";

const Crud_Form = props => {
    const navigate = useNavigate()
    const [searchVal, setSearchVal] = useState()
    const [tableData, setTableData] = useState([])
    const [params, setParams] = useState({
        page: 1,
        limit: 5,
        orderBy: 1
    })
    const [isLoading, setIsLoading] = useState(false)
    const [columns, setColumns] = useState([]);
    const [data, setData] = useState();
    const getUser = () => {
        api.get(`/user?page=${params.page}&limit=${params.limit}&orderBy=${params.orderBy}`)
            .then(response => {
                setTableData(response)
            })
            .catch(err => {
                console.log(err);
            })
    }

    // useEffect(() => {
    //     getUser()
    // }, [])

    // useEffect(() => {
    //     getUser()
    // }, [])

    useEffect(() => {
        if (searchVal?.length > 0) {
            const timeoutId = setTimeout(() => {
                setIsLoading(true)
                api.get(`/user/search/${searchVal}`)
                    .then(response => {
                        setIsLoading(false)
                        setTableData(response)

                    })
                    .catch(err => {
                        setIsLoading(false)
                        console.log(err);
                    })
            }, 1000);
            return () => clearTimeout(timeoutId);
        }
        else {
            getUser()
        }
    }, [searchVal, params]);

    const handleOnChange = (event) => {
        setSearchVal(event.target.value);
    };

    const processData = (dataString) => {
        const dataStringLines = dataString.split(/\r\n|\n/);
        const headers = dataStringLines[0].split(
            /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
        );

        const list = [];
        for (let i = 1; i < dataStringLines.length; i++) {
            const row = dataStringLines[i].split(
                /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
            );
            if (headers && row.length == headers.length) {
                const obj = {};
                for (let j = 0; j < headers.length; j++) {
                    let d = row[j];
                    if (d.length > 0) {
                        if (d[0] == '"') d = d.substring(1, d.length - 1);
                        if (d[d.length - 1] == '"') d = d.substring(d.length - 2, 1);
                    }
                    if (headers[j]) {
                        obj[headers[j]] = d;
                    }
                }

                // remove the blank rows
                if (Object.values(obj).filter((x) => x).length > 0) {
                    list.push(obj);
                }
            }
        }

        // prepare columns list from headers
        const columns = headers.map((c) => ({
            name: c,
            selector: c,
        }));

        setData(list);
        if (list) {
            localStorage.setItem("Bulk_order", JSON.stringify(list));
        }
        setColumns(columns);
        api.post(`/user/bulk`, { data: list, columns })
            .then(response => {
                window.location.reload()
                getUser()
            })
            .catch(err => {
                console.log(err);
            })
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (evt) => {
            /* Parse data */
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: "binary" });
            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            /* Convert array of arrays */
            const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
            processData(data);
        };
        reader.readAsBinaryString(file);
    };

    // if(isLoading){
    //     return <Spinner />
    // }

    const exportToExcel = () => {
        // const local = JSON.parse(localStorage.getItem("admin_coupon"))
        let xls = tableData?.data?.map(row => {
            return {
                "Firstname": row.firstName,
                "Lastname": row.lastName,
                "Middlename": row.middelName,
                "Email": row.email,
                "DOB": moment(row.dateOfBirth).format("DD-MM-YYYY"),
                "Phonenumber": row.phoneNumber
            };
        });
        const ws = XLSX.utils.json_to_sheet(xls);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, "User's List" + fileExtension);
    };

    return (<Container
        m="auto"
        mt="10px"
        border="1px"
        borderRadius="4px"
        maxW="container.lg"
        borderColor="#9A00002d"
    >
        <Flex direction="row" justify="flex-end" gap={2}>
            <Box>
                <button className="btn btn-success align-items-center buttonContainer" style={{
                    cursor: "pointer",
                    position: "relative",
                    border: "1px solid",
                    cursor: "pointer",
                    position: "relative",
                    border: "1px solid",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "40px",
                    width: "40px",
                    display: "flex",
                    borderRadius: "6px",
                    background: "#319795",
                    borderColor: "#319795",
                    color: "#fff"
                }}>
                    <input
                        className="uploadFile"
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileUpload}
                        label="Drag And Drop"
                        style={{
                            position: "absolute",
                            opacity: 0,
                            width: "100%",
                            zIndex: 1,
                            top: 0,
                            left: 0,
                            cursor: "pointer",
                        }}
                    />
                    <AiOutlineCloudUpload />
                </button>
            </Box>
            <Box>
                <Button
                    variant="solid"
                    colorScheme="teal"
                    onClick={exportToExcel}
                >
                    <AiOutlineCloudDownload />
                </Button>
            </Box>
            <Box>
                <Input type="text" placeholder="Enter here for search" className="form-control w-25" onChange={handleOnChange} />
                <a href="http://localhost:4436/uploads/8ee6d554-e131-4a1e-b125-251090b261da.xlsx">
                    <sup>Click here to see which type of file you can upload</sup>
                </a>
            </Box>
        </Flex>

        <TableContainer>
            <Table variant="striped" size="sm">
                <Thead>
                    <Tr>
                        <Th>#</Th>
                        <Th>Name</Th>
                        <Th>Email</Th>
                        <Th>Phone Number</Th>
                        <Th>Image</Th>
                        <Th>DOB</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {tableData?.data?.map((data, index) => (<Tr key={index}>
                        <Td>
                            <Menu>
                                <MenuButton >
                                    <DragHandleIcon />
                                </MenuButton>
                                <MenuList>
                                    <MenuItem onClick={() => {
                                        // ${data?.firstName || ""}-${data?.lastName || ""}
                                        navigate(`/user/${data?._id}`, { state: data })
                                    }}>View</MenuItem>
                                    <MenuItem onClick={() => {
                                        navigate(`/user/edit/${data?._id}`, { state: data })
                                    }}>Edit</MenuItem>
                                    <MenuItem onClick={() => {
                                        api.put(`/user/softDel/${data?._id}`)
                                            .then(response => {
                                                getUser()
                                            })
                                            .catch(err => {
                                                console.log(JSON.stringify(err));
                                            })
                                    }}>Delete</MenuItem>
                                </MenuList>
                            </Menu>
                        </Td>
                        <Td>{data?.firstName || ""} {data?.middelName == "NA" ? "" : "" || ""} {data?.lastName || ""}</Td>
                        <Td>{data?.email}</Td>
                        <Td>{data?.phoneNumber}</Td>
                        <Td>
                            <Image src={data?.image_url} w={10} h={10} />
                        </Td>
                        <Td>{moment(data?.dateOfBirth).format('DD-MMM-yyyy')}</Td>
                    </Tr>))}
                </Tbody>
            </Table>
        </TableContainer>
        <Flex direction="row" mt="5" mb="5" gap={4} justify="space-between" align="center" w="100%" >
            <Box w="100%">
                <FormLabel>Row Per Page</FormLabel>
                <Select onChange={(e) => {
                    setParams({
                        ...params,
                        limit: e.target.value
                    })
                }} w="25%">
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="20">20</option>
                    <option value="75">75</option>
                    <option value="100">100</option>
                </Select>
            </Box>
            {tableData?.data && <Box w="100%">
                {console.log(tableData)}
                <Pagination
                    className="pagination-bar"
                    currentPage={params.page}
                    totalCount={tableData.totalData}
                    pageSize={params.limit}
                    onPageChange={page => setParams({ ...params, page })}
                />
            </Box>}
        </Flex>
    </Container >)
}

Crud_Form.propTypes = {}

export default Crud_Form