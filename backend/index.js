const express = require('express')
const mongoose = require('mongoose')
require("dotenv").config()

const { buildSchema } = require('graphql')
const { createHandler } = require('graphql-http/lib/use/express')

const UserModel = require("./model/Users")
const EmployeeModel = require("./model/Employee")

const app = express()
const PORT = 4000

const connectDB = async() => {
    try{
        console.log(`Attempting to connect to DB`);
        const DB_CONNECTION = process.env.DB_CONNECTION
        mongoose.connect(DB_CONNECTION).then( () => {
            console.log(`MongoDB connected`)
        }).catch( (err) => {
            console.log(`Error while connecting to MongoDB : ${JSON.stringify(err)}`)
        });
    }catch(error){
        console.log(`Unable to connect to DB : ${error.message}`);
        
    }
}
//Schema
const schema = buildSchema(`
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
        }
`)



const root = {
        
       loginUser : async (args) => {

        try {
            const user = await UserModel.findOne({ username: args.username });
            if (!user) return null;

             if(user.password == args.password){
                return user
             }

        }catch(error){
                console.log(`Error logging in : ${error.message}`)
            return null

        }
       },
        getAllEmployees: async () => {

        try{
            const Employees = await EmployeeModel.find()
            return Employees
        }catch(error){
            console.log(`Error while fetching Employees : ${error.message}`)
            return []
        }


        },
        getEmployeeById: async (args)  => {
             try{
                const Employee = await EmployeeModel.findOne({_id: args._id})
                return Employee
            }  catch(error){
                console.log(`Error while fetching Employee : ${error.message}`)
            return null
        }

        },
        searchEmployee: async (_, args) => {
        try {
            const { designation, department } = args;

            const Employee = await EmployeeModel.findOne({
            $or: [
                ...(designation ? [{ designation }] : []),
                ...(department ? [{ department }] : [])
            ]
            });

            return Employee;
        } catch (error) {
            console.log(`Error while fetching Employee: ${error.message}`);
            return null;
            }
        }


        ,
        signupUser : async () => {
            try{
            const newUser = await new UserModel({
                
                username: args.username,
                password: args.password,
                email: args.email
            })
            const savedUser = await newUser.save()
            return savedUser
        }catch(error){
            console.log(`Error while creating user : ${error.message}`)
            return null
        }

        },
        addEmployee : async (args) => {
            try{
                const newEmployee = await new EmployeeModel({
                    first_name: args.first_name,
                    last_name: args.last_name,
                    email: args.email,
                    gender: args.gender,
                    designation: args.designation,
                    salary: args.salary,
                    department: args.department

                })

            }catch(error){
                     console.log(`Error while creating employee : ${error.message}`)
            return null
            }

        },
        updateEmployee : async(args) => {

              try{
                const UpdateEmployee = await EmployeeModel.findOneAndUpdate(
                {_id: args._id},
                {
                    $set: {
                    first_name: args.first_name,
                    last_name: args.last_name,
                    email: args.email,
                    gender: args.gender,
                    designation: args.designation,
                    salary: args.salary,
                    department: args.department
                    }

                },
                {new: true}
            )
            return UpdateEmployee
            }catch(error){
                     console.log(`Error while Updating Employee : ${error.message}`)
            return null
            }

        },
        deleteEmployee : async (args) => {
        try{
            const deletedEmployee = await EmployeeModel.findByIdAndDelete(args._id)
            return deletedEmployee
        }catch(error){
            console.log(`Error while deleting Employee : ${error.message}`)
            return null
        }


        }

}


app.all(
  '/graphql',
  createHandler({
    schema: schema,
    rootValue: root,
  }),
);



app.listen(PORT, () =>{
    connectDB()
    console.log("GraphQL Server started")
    console.log("http://localhost:4000/graphql")
})