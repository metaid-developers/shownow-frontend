import { isEmpty } from "ramda";
import RepostDetail from "./RepostDetail";
import { useQuery } from "@tanstack/react-query";
import { fetchBuzzContent, fetchBuzzDetail } from "@/request/api";
import { Alert, Button, Card, Skeleton, Spin, theme, Typography } from "antd";
import Trans from "../Trans";
import { FormatBuzz, formatSimpleBuzz, PayBuzz, SimpleBuzz } from "@/utils/buzz";
import EnhancedMediaGallery from "./EnhancedMediaGallery";
import PendingUserAvatar from "../UserInfo/PendingUserAvatar";
import { history } from "umi";
import BuzzOriginLink from "./components/BuzzOriginLink";
import { resolveQuoteContent } from "@/utils/quoteContent";

type Props = {
    buzzId: string;
    userAddress?: string;
    host?: string;
}

const formatPublicQuoteContent = (rawContent: {
    content: string;
    attachments?: string[];
    mentions?: Record<string, string>;
}) => {
    return formatSimpleBuzz({
        content: rawContent.content,
        attachments: rawContent.attachments ?? [],
        mentions: rawContent.mentions ?? {},
    });
};

export const SimpleBuzzContent = ({ buzzId, host = '' }: Props) => {
    const { token: { colorBgLayout } } = theme.useToken();
    const { isLoading, data: buzzDetail } = useQuery({
        enabled: !isEmpty(buzzId),
        queryKey: ['buzzContent', buzzId],
        queryFn: () => resolveQuoteContent<API.BuzzDetailData, SimpleBuzz | PayBuzz, FormatBuzz>({
            fetchDetails: () => fetchBuzzDetail({ pinId: buzzId! }),
            fetchContent: () => fetchBuzzContent({ pinId: buzzId! }),
            formatContent: formatPublicQuoteContent,
            emptyContent: () => formatSimpleBuzz({ content: '', attachments: [] } as SimpleBuzz),
        }),
    })
    return <div style={{ flexGrow: 1 }}>{isLoading ? <Skeleton active /> : <div>{

        buzzDetail?.type === 'details' && <RepostDetail buzzItem={buzzDetail.details?.tweet} showHeader={false} panding={0} bordered={false} backgeround={colorBgLayout} showFooter={false} />

    }
        {
            buzzDetail?.type === 'content' && <Spin spinning={buzzDetail.isLoading} >
                <BuzzOriginLink host={host} buzzId={buzzId}>
                    <Typography.Paragraph style={{ marginBottom: 0, fontSize: 12 }}><Typography.Text style={{ lineHeight: '34px' }} >{buzzDetail?.content?.publicContent}</Typography.Text></Typography.Paragraph>
                    {
                        buzzDetail?.content && <EnhancedMediaGallery decryptContent={buzzDetail.content} />
                    }

                </BuzzOriginLink>

            </Spin>
        }




    </div>}</div>
}
export default ({ buzzId, userAddress, host }: Props) => {
    const { token: { colorBgLayout } } = theme.useToken();
    return <Card style={{ padding: 0, marginBottom: 12, boxShadow: "none", border: 'none', background: colorBgLayout }} styles={{
        body: { paddingBottom: 0 }
    }} >
        <div style={{ display: 'flex', gap: 8 }}>
            <PendingUserAvatar address={userAddress!} size={34} />
            <SimpleBuzzContent buzzId={buzzId} host={host} />
        </div>
    </Card>
}
