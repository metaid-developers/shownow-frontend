import { fetchAllBuzzs } from "@/request/api";
import { useEffect, useMemo, useRef, useState } from "react"
import './index.less'
import { Divider, List, Row, Skeleton, Grid, Drawer, Empty, Card } from "antd";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useModel, useMatch, useRouteData, useLocation } from "umi";
import Buzz from "@/Components/Buzz";
import InfiniteScroll from 'react-infinite-scroll-component';
import Trans from "@/Components/Trans";

import KeepAliveWrap from "@/Components/KeepAliveWrap";
import Tweet, { TweetCard } from "../tweet";
import InfiniteScrollV2 from "@/Components/InfiniteScrollV2";
import { createHomeNewBuzzQueryOptions } from "./feedQuery";

const { useBreakpoint } = Grid

const Home = () => {

    const { btcConnector, user, mockBuzz } = useModel('user')
    const [open, setOpen] = useState(false)
    const [currentBuzzId, setCurrentBuzzId] = useState('');
    const containerRef = useRef<any>();
    const contentRef = useRef<any>();
    const { state } = useLocation();

    const targetBuzzId = useMemo(() => {
        return state?.buzzId
    }, [state])
    const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage, refetch, isFetching } =
        useInfiniteQuery({
            ...createHomeNewBuzzQueryOptions(fetchAllBuzzs),
        });

    const tweets = useMemo(() => {
        const _list: API.Buzz[] = data ? data?.pages.reduce((acc, item) => {
            return [...acc || [], ...(item.data?.list ?? []).filter(item => !item.blocked) || []]
        }, []) : [];

        if (mockBuzz) {
            const isContain = _list?.find(item => item.id === mockBuzz?.id)
            return isContain ? _list : [mockBuzz, ..._list,]
        }

        return _list
    }, [data, mockBuzz])

    // 数据更新后检查高度
    useEffect(() => {
        if (!containerRef.current || !contentRef.current || isLoading || !hasNextPage) return;
        const containerHeight = containerRef.current.clientHeight;
        const contentHeight = contentRef.current.scrollHeight;
        // 如果内容高度不足且还有数据，继续加载
        if (contentHeight <= containerHeight) {
            fetchNextPage();
        }
    }, [data, hasNextPage, isLoading]);


    useEffect(() => {
        if (containerRef.current && targetBuzzId) {
            containerRef.current.scrollTop = 0
            refetch();
        }
    }, [targetBuzzId])


    return <div
        // id="scrollableDiv1"
        ref={containerRef}
        style={{
            height: '100%',
            overflow: 'auto',
            paddingBottom: 60
        }}
    >
        {/* {isLoading && <Skeleton avatar paragraph={{ rows: 2 }} active />} */}
        {/* <InfiniteScroll
            dataLength={(tweets ?? []).length}
            next={fetchNextPage}
            hasMore={hasNextPage}
            loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
            endMessage={<Divider plain><Trans>It is all, nothing more 🤐</Trans></Divider>}
            scrollThreshold={0.9}
            scrollableTarget="scrollableDiv1"
        >
            
        </InfiniteScroll> */}

        <List
            loading={isLoading}
            dataSource={tweets}
            ref={contentRef}
            renderItem={(item: API.Pin) => (
                <List.Item key={item.id} >
                    <Buzz buzzItem={item} refetch={refetch} />
                </List.Item>
            )}
        />
        <InfiniteScrollV2
            id="mason_grid"
            onMore={() => {
                if (hasNextPage && !isFetchingNextPage) {
                    fetchNextPage()
                }
            }}
        />
        {(isLoading || isFetchingNextPage) && <Card><Skeleton avatar paragraph={{ rows: 2 }} active /></Card>}
        {(!isFetching && !hasNextPage) &&
            <Divider plain><Trans>It is all, nothing more 🤐</Trans></Divider>}
    </div>


}


export default () => {
    return <Home />

}
