import React, { createContext } from 'react'

export const AuthContext = createContext({ userDoctor: {doctorName: "Bill"}, updateUserDoctor: (doctor) => { this.userDoctor = doctor }, })

export const AuthProvider = AuthContext.Provider

export const AuthConsumer = AuthContext.Consumer

// 
// export const withFirebaseHOC = Component => props => (
//   <AuthConsumer>
//     {state => <Component {...props} firebase={state} />}
//   </AuthConsumer>
// )
