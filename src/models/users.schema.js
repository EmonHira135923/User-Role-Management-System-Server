// Create User Schema
export const createUser = (data) => {
    return {
        name:data.name,
        email:data.email,
        password:data.password,
        phone:data.phone,
        image: {
        url: data.image?.url || null,
        public_id: data.image?.public_id || null
        },
        role: "user",
        createdAt: new Date(),
        updatedAt: null
    }
}