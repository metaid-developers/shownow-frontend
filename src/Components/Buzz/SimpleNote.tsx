import { curNetwork } from "@/config";
import { fetchBuzzDetail, getUserInfo } from "@/request/api";
import {
  LinkOutlined,
  MailOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Card, Tag, Typography, theme } from "antd";
import { isEmpty, isNil } from "ramda";
import { useMemo } from "react";
import { history, useModel } from "umi";
import { FollowIconComponent } from "../Follow";
import UserAvatar from "../UserAvatar";
import BuzzOrigin from "./components/BuzzOrigin";
import EnhancedMediaGallery from "./EnhancedMediaGallery";
import Actions from "./Actions";
import IDCoinBadge from "../IDCoinBadge";
import dayjs from "dayjs";
import { formatSimpleBuzz, type FormatBuzz } from "@/utils/buzz";
import {
  isMarkdownNote,
  parseSimpleNote,
  prepareNoteMarkdown,
} from "@/utils/simplenote";
import { getMetafileOriginalUrl } from "@/utils/metafileUrl";
import { openIdChatDm } from "@/utils/dm";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const { Text, Title, Paragraph } = Typography;

type Props = {
  buzzItem: API.Buzz;
  like?: API.LikeRes[];
  donate?: API.DonateRes[];
  showActions?: boolean;
  handleClick?: () => void;
};

export default ({
  buzzItem,
  like = [],
  donate = [],
  showActions = true,
  handleClick,
}: Props) => {
  const {
    token: { colorBorderSecondary, colorBorder, colorPrimary },
  } = theme.useToken();
  const { user } = useModel("user");

  const currentUserInfoData = useQuery({
    queryKey: ["userInfo", buzzItem!.creator],
    enabled: !isNil(buzzItem?.creator),
    queryFn: () => {
      return getUserInfo({ address: buzzItem!.creator });
    },
  });

  const note = useMemo(
    () => parseSimpleNote(buzzItem?.content),
    [buzzItem?.content]
  );
  const isMarkdown = isMarkdownNote(note);
  const markdownSource = useMemo(
    () => (note ? prepareNoteMarkdown(note.content) : ""),
    [note]
  );

  const { data: noteMedia } = useQuery({
    enabled: !isEmpty(note?.coverImg ?? "") || !isEmpty(note?.attachments ?? []),
    queryKey: ["simplenoteMedia", buzzItem?.id],
    queryFn: async (): Promise<FormatBuzz | undefined> => {
      const attachments = [
        ...(note?.coverImg ? [note.coverImg] : []),
        ...(note?.attachments ?? []),
      ];
      return formatSimpleBuzz({
        content: "",
        attachments,
      });
    },
  });

  const openDetail = () => {
    handleClick ? handleClick() : history.push(`/buzz/${buzzItem.id}`);
  };

  const renderBody = () => {
    if (!note) {
      return (
        <Paragraph style={{ whiteSpace: "pre-wrap", marginBottom: 0 }}>
          {buzzItem?.content}
        </Paragraph>
      );
    }
    if (isMarkdown) {
      return (
        <div className="simpleNoteMarkdown">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: (props) => <Title level={4} {...props} />,
              h2: (props) => <Title level={5} {...props} />,
              h3: (props) => <Title level={5} {...props} />,
              a: ({ children, href }) => {
                if (href?.startsWith("/buzz/")) {
                  return (
                    <a
                      href={href}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        history.push(href);
                      }}
                    >
                      {children}
                    </a>
                  );
                }
                return <a href={href} target="_blank" rel="noreferrer">{children}</a>;
              },
              img: ({ src, alt }) => (
                <img
                  src={src}
                  alt={alt ?? ""}
                  loading="lazy"
                  style={{ maxWidth: "100%", borderRadius: 8, cursor: "pointer" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (src) {
                      window.open(getMetafileOriginalUrl(String(src)), "_blank");
                    }
                  }}
                />
              ),
            }}
          >
            {markdownSource}
          </ReactMarkdown>
        </div>
      );
    }
    return (
      <Paragraph style={{ whiteSpace: "pre-wrap", marginBottom: 0 }}>
        {note.content}
      </Paragraph>
    );
  };

  return (
    <Card
      className="tweet"
      style={{
        width: "100%",
        borderColor: colorBorderSecondary,
      }}
      styles={{
        header: { borderColor: colorBorderSecondary },
        body: { paddingTop: 12 },
      }}
      title={
        <div style={{ height: "100%", padding: "12px 0" }}>
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div className="avatar" style={{ cursor: "pointer", position: "relative" }}>
              <UserAvatar
                src={currentUserInfoData.data?.avatar}
                size={40}
                onClick={(e) => {
                  e.stopPropagation();
                  history.push(`/profile/${buzzItem.creator}`);
                }}
              />
              <FollowIconComponent
                metaid={currentUserInfoData.data?.metaid || ""}
              />
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: 8, cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation();
                history.push(`/profile/${buzzItem.creator}`);
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Text style={{ fontSize: 14, lineHeight: 1 }}>
                  {currentUserInfoData.data?.name || "Unnamed"}
                </Text>
                <Button
                  type="text"
                  size="small"
                  className="dmIconButton"
                  icon={<MailOutlined />}
                  title="Send DM"
                  aria-label="Send DM"
                  disabled={!currentUserInfoData.data?.globalMetaId}
                  style={{ color: colorPrimary }}
                  onClick={(e) => {
                    e.stopPropagation();
                    openIdChatDm(currentUserInfoData.data?.globalMetaId);
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Text type="secondary" style={{ fontSize: 10, lineHeight: 1 }}>
                  {currentUserInfoData.data?.metaid.slice(0, 8)}
                </Text>
                <BuzzOrigin host={buzzItem.host} />
              </div>
            </div>
          </div>
          <IDCoinBadge address={buzzItem.address} />
        </div>
      }
    >
      <div className="content" style={{ cursor: "pointer" }}>
        <div onClick={openDetail}>
          {note?.title ? (
            <Title level={4} style={{ marginTop: 0 }} ellipsis={{ rows: 2 }}>
              {note.title}
            </Title>
          ) : null}
          {note?.subtitle ? (
            <Text type="secondary">{note.subtitle}</Text>
          ) : null}
          {!isEmpty(note?.tags ?? []) ? (
            <div style={{ margin: "8px 0" }}>
              {(note?.tags ?? []).map((tag) => (
                <Tag key={tag} bordered={false} style={{ marginRight: 4 }}>
                  #{tag}
                </Tag>
              ))}
            </div>
          ) : null}
          {renderBody()}
          {noteMedia && <EnhancedMediaGallery decryptContent={noteMedia} />}
          <div style={{ marginTop: 12 }}>
            <Button
              size="small"
              type="link"
              icon={<LinkOutlined />}
              style={{ fontSize: 12 }}
              onClick={(e) => {
                e.stopPropagation();
                const link =
                  buzzItem.chainName === "btc"
                    ? `${curNetwork === "testnet"
                        ? "https://mempool.space/testnet/tx/"
                        : "https://mempool.space/tx/"
                      }${buzzItem.genesisTransaction}`
                    : `https://${curNetwork === "testnet" ? "test" : "www"
                    }.mvcscan.com/tx/${buzzItem.genesisTransaction}`;
                window.open(link, "_blank");
              }}
            >
              {buzzItem.genesisTransaction.slice(0, 8)}
            </Button>
            <Tag
              icon={buzzItem.genesisHeight === 0 ? <SyncOutlined spin /> : null}
              bordered={false}
              color={buzzItem.chainName === "mvc" ? "blue" : "orange"}
            >
              {buzzItem.chainName.toUpperCase()}
            </Tag>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {dayjs.unix(buzzItem.timestamp).format("YYYY-MM-DD HH:mm:ss")}
            </Text>
          </div>
        </div>

        {showActions && (
          <Actions buzzItem={buzzItem} like={like} donate={donate} />
        )}
      </div>
    </Card>
  );
};
