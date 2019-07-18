import * as React from 'react';
import * as cx from 'classnames';
import styles from './templateMocks.module.scss';

export const TypeOneTemplateMock = () => {
    return (
        <div className={cx(styles['wrapper'], styles['margin-bottom10px'], styles['padding-10px'])}>
            <div className={cx(styles['width-100percent'], styles['display-flex'], styles['flex--endVertical'])}>
                <span className={cx(styles['mask-bg'], styles['circle-mask'], styles['height-50px'], styles['width-50px'], styles['margin-bottom-10px'])}></span>
                <span className={cx(styles['mask-bg'], styles['rectangle-mask'], styles['height-15px'], styles['width-50percent'], styles['margin-left10px'], styles['margin-bottom5px'])}></span>
            </div>
            <div className={cx(styles['height-100px'], styles['width-100percent'], styles['margin-top20px'])}>
                <span className={cx(styles['mask-bg'], styles['rectangle-mask'], styles['height-15px'], styles['width-50percent'], styles['margin-bottom10px'])}></span>
                <span className={cx(styles['mask-bg'], styles['rectangle-mask'], styles['height-15px'], styles['width-100percent'], styles['margin-bottom10px'])}></span>
                <span className={cx(styles['mask-bg'], styles['rectangle-mask'], styles['height-15px'], styles['width-100percent'])}></span>
            </div>
            <div className={cx(styles['height-50px'], styles['rectangle-mask'], styles['width-100percent'])} style={{ textAlign: 'center' }}>
                <span className={cx(styles['mask-bg'], styles['height-30px'], styles['rectangle-mask'], styles['width-50percent'], styles['margin-top10px'])}></span>
            </div>
        </div >
    );
}

export const TypeTwoTemplateMock = () => {
    return (
        <div className={cx(styles['wrapper'], styles['type2'])}>
            <span className={cx(styles['mask-bg'], styles['mega-block'], styles['height-150px'], styles['width-100percent'], styles['display-flex'], styles['flex--endVertical'])}>
                <span className={cx(styles['mask-bg'], styles['rectangle-mask'], styles['height-50px'], styles['width-50px'], styles['margin-bottom-10px'], styles['margin-left10px'])}></span>
                <span className={cx(styles['mask-bg'], styles['rectangle-mask'], styles['height-15px'], styles['width-50percent'], styles['margin-left10px'], styles['margin-bottom10px'])}></span>
            </span>
            <div className={cx(styles['height-100px'], styles['width-100percent'], styles['margin-top20px'])}>
                <span className={cx(styles['mask-bg'], styles['rectangle-mask'], styles['height-15px'], styles['width-50percent'], styles['margin-bottom10px'])}></span>
                <span className={cx(styles['mask-bg'], styles['rectangle-mask'], styles['height-15px'], styles['width-100percent'], styles['margin-bottom10px'])}></span>
                <span className={cx(styles['mask-bg'], styles['rectangle-mask'], styles['height-15px'], styles['width-100percent'])}></span>
            </div>
            <div className={cx(styles['height-50px'], styles['rectangle-mask'], styles['width-100percent'])} style={{ textAlign: 'center' }}>
                <span className={cx(styles['mask-bg'], styles['height-30px'], styles['rectangle-mask'], styles['width-50percent'], styles['margin-top10px'])}></span>
            </div>
        </div >
    );
}


export const TypeThreeTemplateMock = () => {
    return (
        <div className={cx(styles['wrapper'], styles['type3'])}>
            <span className={cx(styles['mask-bg'], styles['rectangle-mask'], styles['width-100percent'], styles['margin-top10px'])}><img src={require('../../asset/img/miscellaneous/imagePlaceholder.png')} style={{ width: '100%' }} /></span>
        </div >
    );
}


export const TypeFourTemplateMock = () => {
    return (
        <div className={cx(styles['wrapper'], styles['type4'],styles['padding-10px'])}>
            <span className={cx(styles['mask-bg'], styles['rectangle-mask'], styles['height-15px'], styles['width-50percent'], styles['margin-bottom10px'])}></span>
            <span className={cx(styles['mask-bg'], styles['rectangle-mask'], styles['height-15px'], styles['width-100percent'], styles['margin-bottom10px'])}></span>
            <span className={cx(styles['mask-bg'], styles['rectangle-mask'], styles['height-15px'], styles['width-100percent'])}></span>
        </div >
    );
}


export const TypeFiveTemplateMock = () => {
    return (
        <div className={cx(styles['wrapper'], styles['type5'], styles['height-300px'])}>
            <div className={cx(styles['mask-bg'], styles['rectangle-mask'], styles['height-150px'], styles['width-100percent'], styles['display-flex'], styles['flex--endVertical'], styles['flex--horizontalCentered'])}>
                <span className={cx(styles['mask-bg'], styles['circle-mask'], styles['height-60px'], styles['width-60px'], styles['margin-bottom-20px'])}></span>
            </div>
            <div className={cx(styles['display-flex'], styles['flex--centerVertical'], styles['flex--horizontalCentered'], styles['margin-bottom-20px'],styles['flex-direction--column'])}>
                <span className={cx(styles['mask-bg'], styles['rectangle-mask'], styles['height-15px'], styles['width-80percent'], styles['margin-top30px'], styles['margin-bottom30px'])}></span>
            </div>
            <span className={cx(styles['mask-bg'], styles['rectangle-mask'], styles['height-15px'], styles['width-50percent'], styles['margin-top10px'])}></span>
            <span className={cx(styles['mask-bg'], styles['rectangle-mask'], styles['height-15px'], styles['width-80percent'], styles['margin-top10px'])}></span>
        </div >
    );
}


export const TypeSixTemplateMock = () => {
    return (
        <div className={cx(styles['wrapper'], styles['type6'] )}>
            <div className={cx(styles['mask-bg'], styles['rectangle-mask'], styles['height-150px'], styles['width-100percent'], styles['display-flex'], styles['flex--horizontalCentered'],styles['flex--endVertical'])}>
                <span className={cx(styles['mask-bg'], styles['circle-mask'], styles['height-60px'], styles['width-60px'], styles['margin-bottom-20px'])}></span>
            </div>
            <div className={cx(styles['display-flex'], styles['flex--centerVertical'], styles['flex--horizontalCentered'], styles['margin-bottom20px'] ,styles['flex-direction--column'])}>
                <span className={cx(styles['mask-bg'], styles['rectangle-mask'], styles['height-15px'], styles['width-80percent'], styles['margin-top30px'], styles['margin-bottom30px'])}></span>
                <span className={cx(styles['mask-bg'], styles['rectangle-mask'], styles['height-15px'], styles['width-80percent'], styles['margin-top10px'])}></span>
                <span className={cx(styles['mask-bg'], styles['rectangle-mask'], styles['height-15px'], styles['width-50percent'], styles['margin-top10px'])}></span>
            </div>
            <div className={cx(styles['display-flex'], styles['flex--centerVertical'], styles['flex--horizontalCentered'],styles['margin-bottom10px'])}>
                <span className={cx(styles['mask-bg'], styles['height-30px'], styles['rectangle-mask'], styles['width-50percent'], styles['margin-top10px'])}></span>
            </div>

        </div >
    );
}

// for thank you 
export const TypeSevenTemplateMock = () => {
    return (
        <div className={cx(styles['wrapper'], styles['type7'] )}>
             <div className={cx(styles['display-flex'], styles['flex--centerVertical'],styles['margin-bottom10px'])}>
                <span className={cx(styles['mask-bg'], styles['height-20px'], styles['rectangle-mask'], styles['width-40px'])}></span>
                <span className={cx(styles['mask-bg'], styles['height-20px'], styles['rectangle-mask'], styles['width-100percent'],styles['margin-left10px'])}></span>
            </div>
            <div className={cx(styles['margin-bottom10px'])}>
                <span className={cx(styles['mask-bg'], styles['rectangle-mask'], styles['height-15px'], styles['width-80percent'], styles['margin-top10px'])}></span>
                <span className={cx(styles['mask-bg'], styles['rectangle-mask'], styles['height-15px'], styles['width-50percent'], styles['margin-top10px'])}></span>
            </div>
            <div className={cx(styles['display-flex'], styles['flex--centerVertical'], styles['flex--horizontalEnd'],styles['margin-bottom10px'])}>
                <span className={cx(styles['mask-bg'], styles['height-30px'], styles['width-30px'], styles['circle-mask'],styles['margin-left-5px'])}></span>
                <span className={cx(styles['mask-bg'], styles['height-30px'], styles['width-30px'], styles['circle-mask'],styles['margin-left-5px'])}></span>
                <span className={cx(styles['mask-bg'], styles['height-30px'], styles['width-30px'], styles['circle-mask'],styles['margin-left-5px'])}></span>
                <span className={cx(styles['mask-bg'], styles['height-30px'], styles['width-30px'], styles['circle-mask'],styles['margin-left-5px'])}></span>
                <span className={cx(styles['mask-bg'], styles['height-30px'], styles['width-30px'], styles['circle-mask'],styles['margin-left-5px'])}></span>
            </div>
        </div >
    );
}