import AddNewButton from '@AddNewButton';
import { PieChartOutlined, TeamOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import { cloneObj, toast } from '@app/common/functionCommons';
import {
  createUser,
  deleteUser,
  getAllUsers,
  updateUser,
} from '@app/services/Account';
import ActionCell from '@components/ActionCell';
import Loading from '@components/Loading';
import { CONSTANTS, USER_TYPE } from '@constants';
import AccountDetail from '@containers/Account/AccountDetail';
import { message, Table, Tabs, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { G2, Pie } from '@ant-design/plots';
import CustomBreadcrumb from '@components/CustomBreadcrumb';

const { TabPane } = Tabs;

function Account({ isLoading, myInfo }) {
  const [dataUser, setDataUser] = useState([]);
  let { t } = useTranslation();
  const [stateUser, setStateUser] = useState({
    isShowModal: false,
    userSelected: null,
  });

  useEffect(() => {
    (async () => {
      await getDataUser();
    })();
  }, []);

  async function getDataUser() {
    const apiResponse = await getAllUsers();
    if (apiResponse) {
      setDataUser(apiResponse);
    }
  }

  async function handleDeleteUser(userSelected) {
    const apiResponse = await deleteUser(myInfo._id, userSelected._id);
    if (apiResponse) {
      await getDataUser();
      message.success(t('XOA_TAI_KHOAN_THANH_CONG'));
    }
  }

  const userColumns = [
    { title: <div className="format-title-table">{t('HO_TEN')}</div>, dataIndex: 'fullname' },
    { title: <div className="format-title-table">{t('TEN_DANG_NHAP')}</div>, dataIndex: 'username' },
    { title: <div className="format-title-table">{t('DIEN_THOAI')}</div>, dataIndex: 'phoneNumber' },
    { title: <div className="format-title-table">{t('DIA_CHI_EMAIL')}</div>, dataIndex: 'email' },
    {
      title: <div className="format-title-table">{t('TRANG_THAI')}</div>,
      dataIndex: 'active', align: 'center',
      // render: () => {
      //   return <Text>{t('HOAT_DONG')}</Text>;
      // },
      render: () => {
        return <Tag color="success" className="m-0">{t('HOAT_DONG')}</Tag>;
      },
    },
    {
      title: <div className="format-title-table">{t('THAO_TAC')}</div>,
      align: 'center',
      render: (value) => (
        <ActionCell
          value={value}
          handleEdit={() => setStateUser({ isShowModal: true, userSelected: value })}
          handleDelete={handleDeleteUser}
          disabledDelete={value.role === USER_TYPE.ADMIN.code}
          deleteText={t('XOA')}
          title={t('XOA_DU_LIEU')}
          okText={t('XOA')}
          cancelText={t('HUY')}
          editText={t('SUA')}
        />
      ),
      fixed: 'right',
      width: 200,
    },
  ];

  const DemoPie = () => {
    const G = G2.getEngine('canvas');
    const data = [
      {
        type: t('DUNG_LUONG_CON_TRONG'),
        value: 80,
      },
      {
        type: t('DUNG_LUONG_SU_DUNG'),
        value: 20,
      },

    ];
    const cfg = {
      appendPadding: 10,
      data,
      angleField: 'value',
      colorField: 'type',
      radius: 0.75,
      legend: false,
      label: {
        type: 'spider',
        labelHeight: 40,
        formatter: (data, mappingData) => {
          const group = new G.Group({});
          group.addShape({
            type: 'circle',
            attrs: {
              x: 0,
              y: 0,
              width: 40,
              height: 50,
              r: 5,
              fill: mappingData.color,
            },
          });
          group.addShape({
            type: 'text',
            attrs: {
              x: 10,
              y: 8,
              text: `${data.type}`,
              fill: mappingData.color,
            },
          });
          group.addShape({
            type: 'text',
            attrs: {
              x: 0,
              y: 25,
              text: `${(data.percent * 100).toFixed(3)}%`,
              fill: 'rgba(0, 0, 0, 0.65)',
              fontWeight: 700,
            },
          });
          return group;
        },
      },
      interactions: [
        {
          type: 'element-selected',
        },
        {
          type: 'element-active',
        },
      ],
    };
    return <Pie {...(cfg)} />;
  };

  function renderManageDiskTab() {
    return (
      <TabPane
        tab={
          <div style={{ fontSize: 15 }}>
            <PieChartOutlined style={{ fontSize: 15 }}/>
            {t('QUAN_LY_TAI_NGUYEN_HE_THONG')}
          </div>
        }
        key="disk"
      >
        <Loading active={isLoading}>
          <DemoPie/>
        </Loading>
      </TabPane>
    );
  }

  function handleShowModalUser(isShowModal, userSelected = null) {
    if (isShowModal) {
      setStateUser({ isShowModal, userSelected });
    } else {
      setStateUser({ ...stateUser, isShowModal });
    }
  }

  async function createAndModifyUser(type, dataForm) {
    const dataRequest = cloneObj(dataForm);
    let apiResponse = null;
    if (type === CONSTANTS.CREATE) {
      // dataRequest.roles = ['moderator'];
      apiResponse = await createUser(dataRequest);
      if (apiResponse) {
        await getDataUser();
      }
    }

    if (type === CONSTANTS.UPDATE) {
      apiResponse = await updateUser(stateUser.userSelected._id, dataRequest);
      if (apiResponse) {
        delete apiResponse.token;
        const docs = dataUser.map((doc) => {
          if (doc._id === apiResponse?._id) {
            doc = apiResponse;
          }
          return doc;
        });
        setDataUser(docs);
      }
    }
    if (apiResponse) {
      handleShowModalUser(false);
      toast(CONSTANTS.SUCCESS, `${type === CONSTANTS.CREATE ? t('TAO_MOI') : t('CAP_NHAT')} ${t('THONG_TIN_TAI_KHOAN_THANH_CONG')}`);
    }
  }

  return (
    <>
      <CustomBreadcrumb breadcrumbLabel={t('QUAN_LY')}/>
      <div className="site-layout-background">
        <Tabs type="card">
          <TabPane
            tab={
              <div style={{ fontSize: 15 }}>
                <TeamOutlined style={{ fontSize: 15 }}/>
                {t('QUAN_LY_TAI_KHOAN')}
              </div>
            }
            key="taiKhoan"
          >
            <AddNewButton label={t('TAO_MOI')} onClick={() => handleShowModalUser(true)} disabled={isLoading}/>
            <Loading active={isLoading}>
              <Table
                bordered
                rowKey="_id"
                size="small"
                style={{ width: '100%' }}
                columns={userColumns}
                dataSource={dataUser}
                pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '50', '100'] }}
                scroll={{ x: 'max-content' }}
              />
            </Loading>
          </TabPane>
          {renderManageDiskTab()}
        </Tabs>
      </div>

      <AccountDetail
        type={!!stateUser.userSelected ? CONSTANTS.UPDATE : CONSTANTS.CREATE}
        isModalVisible={stateUser.isShowModal}
        handleOk={createAndModifyUser}
        handleCancel={() => handleShowModalUser(false)}
        userSelected={stateUser.userSelected}
        // dataDonViByUser={dataDonViByUser}
      />
    </>
  );
}

function mapStateToProps(store) {
  const { isLoading } = store.app;
  const { myInfo } = store.user;
  return { isLoading, myInfo };
}

export default connect(mapStateToProps, null)(Account);
