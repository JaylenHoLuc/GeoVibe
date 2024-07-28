import createSupabaseClient from '@/lib/supabaseclient';
const LIMIT = 5;
const  getAllPosts = async () => {
    const supabase = await createSupabaseClient()
    const allPosts = await supabase.from('Posts')
        .select()
        .like("pic_uri", '%jpg%')
        .order('created_at', {ascending : false})
        .limit(LIMIT);
    console.log("all posts :  ", allPosts)
    return allPosts['data'];


}

const  getAllPostsUnlimited = async () => {
    const supabase = await createSupabaseClient()
    const allPosts = await supabase.from('Posts')
        .select()
        .like("pic_uri", '%jpg%')
        .order('created_at', {ascending : false});
    return allPosts['data'];
}

const getRealNameFromUserName  = async (username: string) => {
    const supabase = await createSupabaseClient()
    const data = await supabase.from('Users').select().eq("username", username).limit(1)
    return data.data[0].name
}

const getPublicPicUrl = async (filename: string) => {
    const {data} = createSupabaseClient().storage.from('user-images').getPublicUrl(filename);
    return data["publicUrl"]
}
export {getAllPosts, getAllPostsUnlimited, getRealNameFromUserName, getPublicPicUrl};