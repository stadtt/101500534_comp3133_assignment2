const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require("dotenv").config()

const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@as-integrations/express5')

const UserModel = require("./model/Users")
const EmployeeModel = require("./model/Employee")

const app = express()
const PORT = 4000

app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

const connectDB = async() => {
    try {
        console.log('Attempting to connect to DB')
        const DB_CONNECTION = process.env.DB_CONNECTION
        await mongoose.connect(DB_CONNECTION)
        console.log('MongoDB connected')
    } catch (error) {
        console.log(`Unable to connect to DB : ${error.message}`)
        throw error
    }
}

const typeDefs = `
        type Query {
            loginUser(username: String!, password: String!): User
            getAllEmployees: [Employee]
            getEmployeeById(_id: ID!): Employee
            searchEmployee(
                designation: String
                department: String
            ): [Employee]
        }

        type Mutation {
            signupUser(username: String!, password: String!, email: String!): User
            addEmployee(
                first_name: String
                last_name: String
                email: String
                gender: String
                designation: String
                salary: Float
                date_of_joining: String
                department: String
                employee_photo: String
            ): Employee

            updateEmployee(
                _id: ID!
                first_name: String
                last_name: String
                email: String
                gender: String
                designation: String
                salary: Float
                date_of_joining: String
                department: String
                employee_photo: String
            ): Employee

            deleteEmployee(_id: ID!): Employee
        }

        type User {
            id: ID
            username: String
            password: String
            email: String
        }

        type Employee {
            _id: ID
            first_name: String
            last_name: String
            email: String
            gender: String
            designation: String
            salary: Float
            date_of_joining: String
            department: String
            employee_photo: String
        }
`

const resolvers = {
    Query: {
        loginUser: async (_, args) => {
            try {
                const username = args.username.trim().toLowerCase()
                const user = await UserModel.findOne({ username }).select('+password')
                if (!user) return null

                if (user.password === args.password) {
                    return user
                }

                return null
            } catch (error) {
                console.log(`Error logging in : ${error.message}`)
                return null
            }
        },
        getAllEmployees: async () => {
            try {
                return await EmployeeModel.find()
            } catch (error) {
                console.log(`Error while fetching Employees : ${error.message}`)
                return []
            }
        },
        getEmployeeById: async (_, args) => {
            try {
                return await EmployeeModel.findById(args._id)
            } catch (error) {
                console.log(`Error while fetching Employee : ${error.message}`)
                return null
            }
        },
        searchEmployee: async (_, args) => {
            try {
                const { designation, department } = args
                const filters = []

                if (designation) {
                    filters.push({ designation })
                }
                if (department) {
                    filters.push({ department })
                }

                if (filters.length === 0) {
                    return await EmployeeModel.find()
                }

                return await EmployeeModel.find({ $or: filters })
            } catch (error) {
                console.log(`Error while fetching Employee: ${error.message}`)
                return []
            }
        }
    },
    Mutation: {
        signupUser: async (_, args) => {
            try {
                const newUser = new UserModel({
                    username: args.username,
                    password: args.password,
                    email: args.email
                })

                const savedUser = await newUser.save()
                return savedUser
            } catch (error) {
                console.log(`Error while creating user : ${error.message}`)
                return null
            }
        },
        addEmployee: async (_, args) => {
            try {
                const newEmployee = new EmployeeModel({
                    first_name: args.first_name,
                    last_name: args.last_name,
                    email: args.email,
                    gender: args.gender,
                    designation: args.designation,
                    salary: args.salary,
                    date_of_joining: args.date_of_joining,
                    department: args.department,
                    employee_photo: args.employee_photo
                })

                return await newEmployee.save()
            } catch (error) {
                console.log(`Error while creating employee : ${error.message}`)
                return null
            }
        },
        updateEmployee: async (_, args) => {
            try {
                const updateFields = {
                    first_name: args.first_name,
                    last_name: args.last_name,
                    email: args.email,
                    gender: args.gender,
                    designation: args.designation,
                    salary: args.salary,
                    date_of_joining: args.date_of_joining,
                    department: args.department,
                    employee_photo: args.employee_photo
                }

                Object.keys(updateFields).forEach((key) => {
                    if (updateFields[key] === undefined) {
                        delete updateFields[key]
                    }
                })

                return await EmployeeModel.findOneAndUpdate(
                    { _id: args._id },
                    { $set: updateFields },
                    { new: true }
                )
            } catch (error) {
                console.log(`Error while Updating Employee : ${error.message}`)
                return null
            }
        },
        deleteEmployee: async (_, args) => {
            try {
                return await EmployeeModel.findByIdAndDelete(args._id)
            } catch (error) {
                console.log(`Error while deleting Employee : ${error.message}`)
                return null
            }
        }
    }
}

const startServer = async () => {
    await connectDB()

    const server = new ApolloServer({
        typeDefs,
        resolvers
    })

    await server.start()

    app.use('/graphql', express.json(), expressMiddleware(server))

    app.listen(PORT, () => {
        console.log('GraphQL Server started')
        console.log(`http://localhost:${PORT}/graphql`)
    })
}

startServer().catch((error) => {
    console.log(`Server startup failed: ${error.message}`)
})