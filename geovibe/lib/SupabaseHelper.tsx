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

const  getAllPostsGuessed = async () => {
    const supabase = await createSupabaseClient()
    const { data: guesses, error: guessError } = await supabase
    .from('Guesses')
    .select('post_id')
    .eq('success', true)

    const post_ids = guesses.map(guess => guess.post_id)

    const { data: posts, error: postError } = await supabase
    .from('Posts')
    .select('*')
    .in('id', post_ids)

    return posts
    
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
export {getAllPosts, getAllPostsUnlimited, getRealNameFromUserName, getPublicPicUrl, getAllPostsGuessed};