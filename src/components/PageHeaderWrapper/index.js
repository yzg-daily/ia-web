import React from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import PageHeader from '@/components/PageHeader';
import GridContent from './GridContent';
import styles from './index.less';
import MenuContext from '@/layouts/MenuContext';

const PageHeaderWrapper = ({ children, contentWidth, wrapperClassName, top, ...restProps }) => (
    <div style={{ margin: '-24px -24px 0' }} className={wrapperClassName}>
        {top}
        <MenuContext.Consumer>
            {() => (
                <PageHeader
                    className='pageHeaderWrapper'
                    key='pageheader'
                    {...restProps}
                    linkElement={Link}
                    itemRender={item => {
                        if (item.locale) {
                            return item.title;
                        }
                        return item.name;
                    }}
                />
            )}
        </MenuContext.Consumer>
        {children ? (
            <div className={styles.content}>
                <GridContent>{children}</GridContent>
            </div>
        ) : null}
    </div>
);

export default connect(({ setting }) => ({
    contentWidth: setting.contentWidth,
}))(PageHeaderWrapper);
