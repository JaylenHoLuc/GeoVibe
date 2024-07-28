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
export default getAllPosts;