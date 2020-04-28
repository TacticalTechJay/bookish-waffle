module.exports = async (client, id) => {
    const user = await client.orm.repos.user.findOne({ id });
    if (!user) return await client.orm.repos.user.save({ id });
    return user;
};