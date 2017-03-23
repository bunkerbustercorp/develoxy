import React, { Component } from 'react';

// Redux 관련 코드
import * as headerActions from 'redux/modules/base/header';
import * as myloxyActions from 'redux/modules/myloxy';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// MyLoxy 관련 컴포넌트 로딩
import MyLoxy, { LeftBar, PostBody } from 'components/MyLoxy';
import SideContents, { PreviewList } from 'components/MyLoxy/SideContents';


class MyLoxyRoute extends Component {

    handleLeftBarClick = (value) => {
        if(value === 'home') {
            // 홈의 경우..
            return;
        }

        if(value === 'search') {
            // 검색의 경우...
            return;
        }

        const { MyLoxyActions } = this.props;
        MyLoxyActions.selectLeftBarMenu(value);
    }

    componentDidMount() {
        // 마운트 시 헤더를 숨긴다
        const { HeaderActions } = this.props;
        HeaderActions.hideHeader();
    }

    componentWillUnmount() {
        // 다른 페이지로 이동 할 때 헤더를 다시 보여준다
        const { HeaderActions } = this.props;
        HeaderActions.showHeader();
    }
    
    
    render() {
        // 편의를 위한 리퍼런스 생성
        const { status: { leftBarMenu } } = this.props;
        const { handleLeftBarClick } = this;
        const count = 713;


        return (
            <MyLoxy>
                <LeftBar selected={leftBarMenu} onClick={handleLeftBarClick}/>
                <SideContents 
                    menu={leftBarMenu}
                    count={count}
                >
                    <PreviewList/>
                </SideContents>
                <PostBody/>
            </MyLoxy>
        );
    }
}

MyLoxyRoute = connect(
    state => ({
        status: {
            leftBarMenu: state.myloxy.get('leftBarMenu')
        }
    }),
    dispatch => ({
        // Actions: bindActionCreators(actions, dispatch)
        HeaderActions: bindActionCreators(headerActions, dispatch),
        MyLoxyActions: bindActionCreators(myloxyActions, dispatch)
    })
)(MyLoxyRoute);

export default MyLoxyRoute;