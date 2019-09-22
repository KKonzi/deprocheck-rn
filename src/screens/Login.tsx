import React from 'react';
import styled from 'styled-components/native';
import { Platform, TextInput, Dimensions } from 'react-native';
import { NavigationScreenComponent } from 'react-navigation';
import { getInset } from 'react-native-safe-area-view';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import _partial from 'lodash/partial';

import { getUserInfo, storeUserInfo } from '../utils/storage';
import { isSmallDeviceSize } from '../utils/styleUtils';
import { replace } from '../navigators/NavigationService';
import { AppContext, UserContext } from '../contexts';
import { requestMemberLoginByName } from '../modules/auth';
import {
  img_deprocheck_logo,
  img_deprocheck_logo_2,
  icon_close,
  img_deprocheck_white,
  icon_baseline_close,
} from '../assets/images';
import { colors } from '../utils/theme';

import DCTouchable from '../components/DCTouchable';
import DCText from '../components/DCText';
import ScreenWrap from '../components/ScreenWrap';
import SwitchToggle from '../components/SwitchToggle';

const { height: DEVICE_HEIGHT } = Dimensions.get('window');

const Wrap = styled(KeyboardAwareScrollView)`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
`;

const Header = styled.View`
  padding: 38px;
`;

const Body = styled.View`
  padding: 0 38px;
  height: ${isSmallDeviceSize()
    ? DEVICE_HEIGHT * 0.58
    : DEVICE_HEIGHT * 0.48 - getInset('top')};
  justify-content: space-between;
`;

const NameInput = styled.TextInput.attrs({ allowFontScaling: false })`
  font-size: 14px;
  border-bottom-color: ${({ theme }) => theme.reverseBackColor};
  border-bottom-width: 2px;
  margin-bottom: 19px;
  padding-bottom: 15px;
  font-family: ${Platform.OS === 'ios'
    ? 'NotoSansCJKkr-Regular'
    : 'NotoSansKR - Regular'};
  color: ${({ theme }) => theme.reverseBackColor};
`;

const JobButtonContainer = styled.View`
  flex-direction: row;
`;

const WhiteLogoContainer = styled.View`
  flex-direction: row;
  margin-top: 21px;
  align-items: baseline;
`;

const AdminText = styled(DCText).attrs({ isLight: true })`
  color: white;
  font-size: 14px;
`;

const InnerView = styled.View``;

const JobButton = styled(DCTouchable)<{
  isLast?: boolean;
  isSelected: boolean;
}>`
  flex: 1;
  justify-content: center;
  align-items: center;
  border: solid 1px #dddddd;
  height: 50px;
  border-left-width: ${({ isLast }) => (isLast ? 0 : 1)}px;
  background-color: ${({ isSelected }) =>
    isSelected ? colors.blue : colors.white};
`;

const JobText = styled.Text<{ isSelected: boolean }>`
  color: #222222;
  font-weight: 500;
  font-size: 14px;
  letter-spacing: -0.3px;
  color: ${({ isSelected }) => (isSelected ? colors.white : colors.black)};
`;

const Footer = styled(DCTouchable)`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  justify-content: center;
  align-items: center;
  height: ${getInset('bottom') + 80}px;
  background-color: ${({ theme }) => theme.reverseBackColor};
`;

const StyledToggle = styled(SwitchToggle).attrs(({ theme }) => ({
  circleColorOn: theme.background,
  circleColorOff: theme.background,
  backgroundColorOn: theme.reverseBackColor,
  backgroundColorOff: theme.reverseBackColor,
}))``;

const MemberLogo = styled.Image.attrs({
  source: img_deprocheck_logo,
  resizeMode: 'contain',
})`
  width: 220px;
  height: 153px;
`;

const AdminLogo = styled.Image.attrs({
  source: img_deprocheck_logo_2,
  resizeMode: 'contain',
})`
  width: 220px;
  height: 153px;
`;

const EnterText = styled.Text`
  color: ${({ theme }) => theme.background};
  font-size: 18px;
  font-weight: bold;
  letter-spacing: -0.36px;
`;

const NameInputView = styled.View``;

const ClostButton = styled(DCTouchable).attrs({
  noEffect: true,
  hitSlop: { top: 10, right: 10, bottom: 10, left: 10 },
})`
  position: absolute;
  right: 5px;
`;

const CloseIcon = styled.Image.attrs({ source: icon_close })`
  width: 16px;
  height: 16px;
`;

const AdminTitieSecond = styled.Text`
  color: ${colors.white};
  font-size: 40px;
  line-height: 46px;
`;

const AdminTitieFirst = styled(AdminTitieSecond).attrs({ isLight: true })``;

const AdminTitieThird = styled(AdminTitieSecond)`
  font-weight: bold;
`;

const WhiteLogo = styled.Image.attrs({ source: img_deprocheck_white })`
  width: 200px;
  height: 32px;
  margin-right: 6px;
`;

const ModalButton = styled(DCTouchable)`
  flex: 1;
  padding: 15px 0;
  justify-content: center;
  align-items: center;
`;

const ModalText = styled(DCText)`
  color: ${colors.blue};
  font-weight: bold;
`;

enum JobType {
  DEVELOPER,
  DESGINER,
}

const Login: NavigationScreenComponent = () => {
  const { state, dispatch } = React.useContext(AppContext);
  const { dispatch: authDispatch } = React.useContext(UserContext);
  const [jobType, setJobType] = React.useState<undefined | JobType>(undefined);
  const [name, setName] = React.useState('');
  const inputRef = React.useRef<TextInput>(null);

  React.useEffect(() => {
    const initUserStatus = async () => {
      const storedUserInfo = await getUserInfo();
      if (storedUserInfo) {
        setJobType(storedUserInfo.job);
        setName(storedUserInfo.name);
        dispatch({
          type: 'CHANGE_THEME',
          payload: { theme: storedUserInfo.mode },
        });
      }
    };

    initUserStatus();
  }, [dispatch]);

  const setUserStatus = () => {
    const userInfo = {
      name,
      job: jobType,
      mode: state.theme,
    };
    storeUserInfo(userInfo);
  };

  const onChangeName = (nameText: string) => {
    setName(nameText);
  };

  const onSelectJob = (type: JobType) => {
    setJobType(type);
  };

  const onPressClear = () => {
    if (inputRef.current) {
      inputRef.current.clear();
      inputRef.current.focus();
    }
  };

  const toggleModal = (visible: boolean) => {
    dispatch({ type: 'SET_MODAL_VISIBLE', payload: { modalVisible: visible } });
  };

  const modalOpen = () => {
    const inputName = state.theme === 'ADMIN' ? '관리자 번호를' : '이름을';

    dispatch({
      type: 'SET_MODAL_INFO',
      payload: {
        modalInfos: {
          titleImage: icon_baseline_close,
          message: `${inputName} 입력해주세요!`,
          buttons: (
            <ModalButton onPress={_partial(toggleModal, false)}>
              <ModalText>확인</ModalText>
            </ModalButton>
          ),
        },
      },
    });
    toggleModal(true);
  };

  const onLogin = async () => {
    if ((inputRef.current, name.length === 0)) {
      modalOpen();
      return;
    }

    gotoHome();
    // try {\
    //   // FIXME: 일단 아무이름이나 하드코딩
    //   const data = await requestMemberLoginByName('한영수');
    //   if (data.accessToken) {
    //     authDispatch({
    //       type: 'SET_USER_INFO',
    //       payload: { userInfo: { name: '한영수' } },
    //     });

    //     gotoHome();
    //   }
    // } catch (error) {
    //   console.log('error', error);
    // }
  };

  const gotoHome = () => {
    // 화면을 따로 만들고 공통된 컴포넌트 최대한 활용
    // 사용자 위치는 renderProps 디자인 패턴을 활용해서 재활용

    setUserStatus();
    if (state.theme === 'ADMIN') {
      replace('Admin');
      return;
    }
    replace('UserAttend');
  };

  const onPressToggle = () => {
    setName('');
    if (state.theme === 'ADMIN') {
      dispatch({ type: 'CHANGE_THEME', payload: { theme: 'MEMBER' } });
      setJobType(undefined);
      return;
    }

    dispatch({ type: 'CHANGE_THEME', payload: { theme: 'ADMIN' } });
  };

  const renderBodyImage = () => {
    const { theme } = state;

    if (theme === 'MEMBER') {
      return <MemberLogo />;
    }

    return (
      <InnerView>
        <AdminTitieFirst>디자이너와</AdminTitieFirst>
        <AdminTitieSecond>프로그래머가</AdminTitieSecond>
        <AdminTitieThird>만났을 때</AdminTitieThird>
        <WhiteLogoContainer>
          <WhiteLogo />
          <AdminText>Admin</AdminText>
        </WhiteLogoContainer>
      </InnerView>
    );
  };

  return (
    <ScreenWrap mode={state.theme} forceInset={{ bottom: 'never' }}>
      <Wrap keyboardShouldPersistTaps="handled">
        <Header>
          <StyledToggle
            switchOn={state.theme === 'ADMIN'}
            onPress={onPressToggle}
          />
        </Header>
        <Body>
          {renderBodyImage()}
          <InnerView>
            <NameInputView>
              <NameInput
                value={name}
                onChangeText={onChangeName}
                placeholder={
                  state.theme === 'MEMBER'
                    ? `이름을 입력해주세요`
                    : '관리자 번호를 입력해 주세요'
                }
                ref={inputRef}
                placeholderTextColor={
                  state.theme === 'ADMIN' ? colors.white : colors.black
                }
              />
              <ClostButton onPress={onPressClear}>
                <CloseIcon />
              </ClostButton>
            </NameInputView>
            {state.theme === 'MEMBER' && (
              <JobButtonContainer>
                <JobButton
                  isSelected={jobType === JobType.DESGINER}
                  onPress={_partial(onSelectJob, JobType.DESGINER)}
                >
                  <JobText isSelected={jobType === JobType.DESGINER}>
                    Designer
                  </JobText>
                </JobButton>
                <JobButton
                  isLast
                  isSelected={jobType === JobType.DEVELOPER}
                  onPress={_partial(onSelectJob, JobType.DEVELOPER)}
                >
                  <JobText isSelected={jobType === JobType.DEVELOPER}>
                    Developer
                  </JobText>
                </JobButton>
              </JobButtonContainer>
            )}
          </InnerView>
        </Body>
      </Wrap>
      <Footer onPress={onLogin}>
        <EnterText>
          {state.theme === 'MEMBER' ? '입장하기' : '로그인하기'}
        </EnterText>
      </Footer>
    </ScreenWrap>
  );
};

export default Login;
