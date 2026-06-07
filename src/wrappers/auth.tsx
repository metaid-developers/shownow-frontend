import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { Navigate, Outlet, useModel } from 'umi'
import { getAuthRenderState } from './authState';

export default (props) => {
  const { isLogin, initializing } = useModel('user');
  const { showConf, loading } = useModel('dashboard')
  const renderState = getAuthRenderState({
    dashboardLoading: loading,
    initializing,
    isLogin,
    checkLogin: showConf?.checkLogin,
  });
  if (renderState === 'loading') {
    return <Spin spinning fullscreen indicator={<LoadingOutlined style={{ color: showConf?.brandColor }} spin />} />
  }
  if (renderState === 'outlet') {
    return <Outlet />;
  } else {
    return <Navigate to="/login" />;
  }
}
