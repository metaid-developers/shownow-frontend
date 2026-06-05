import { AVATAR_BASE_URL, DEFAULT_AVATAR } from "@/config";
import { normalizeAvatarUrl } from "@/utils/avatar";
import { Avatar } from "antd";

type Props = {
    src: string | null | undefined;
    size?: number;
    onClick?: (e:any) => void;
}
export default (
    {
        src,
        size = 40,
        onClick
    }: Props
) => {
    const avatarSrc = normalizeAvatarUrl(src, AVATAR_BASE_URL) || DEFAULT_AVATAR;
    
    return <Avatar style={{
        minHeight: size,
        minWidth: size,
        maxHeight: size,
        maxWidth: size,
        border: "1px solid rgba(0, 0, 0, 0.06)"
    }} src={<img style={{
        objectFit: 'cover',
    }} src={avatarSrc} onError={({ currentTarget }) => {
        currentTarget.onerror = null
        currentTarget.src = DEFAULT_AVATAR;
    }}></img>} size={size}  onClick={onClick} alt="avatar" >

    </Avatar>
}
