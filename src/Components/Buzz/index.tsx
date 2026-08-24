
import Details from "./Details";
import ShareChatMessage from "./ShareChatMessage";
import SimpleNote from "./SimpleNote";
import { SIMPLENOTE_PATH } from "@/utils/simplenote";

type Props = {
    buzzItem: API.Buzz
    showActions?: boolean,
    padding?: number
    reLoading?: boolean
    refetch?: () => Promise<any>
    like?: API.LikeRes[]
    donate?: API.DonateRes[];
    handleClick?: () => void
}

export default ({ buzzItem, showActions = true, padding = 20, reLoading = false, refetch, like = [], handleClick, donate = [] }: Props) => {
    return <>
        {buzzItem.path === '/protocols/sharechatmessage' ?
            <ShareChatMessage buzzItem={buzzItem} like={like} donate={donate} showActions={showActions} padding={padding} reLoading={reLoading} refetch={refetch} handleClick={handleClick} />
            : buzzItem.path === SIMPLENOTE_PATH ?
                <SimpleNote buzzItem={buzzItem} like={like} donate={donate} showActions={showActions} handleClick={handleClick} />
                : <Details buzzItem={buzzItem} showActions={showActions} padding={padding} reLoading={reLoading} refetch={refetch} isForward={false} like={like} donate={donate} handleClick={handleClick} />
        }
    </>
}