import * as React from 'react';
import * as cx from 'classnames';
import styles from './templates.module.scss';
import { Image } from '../common/LazyImage/LazyImage';
import { templateProperties, fphValuesDictionary } from '../../constants/constant';
// template type 1 
function openInNewTab(to): void {
    window.open(to, '_blank');
}

function trimText(source: string, length: number) {
    if (source.length > length) return `${source.substr(0, length)} ...`;
    return source;
}

function getShortNameDisplay(fullname: string): string {
    let nameSegaments = fullname.split(" ");
    let firstnameChar = nameSegaments[0].charAt(0);
    let lastnameChar = nameSegaments[nameSegaments.length - 1].charAt(0);
    return `${firstnameChar}${lastnameChar}`;
}


export const TypeOneTemplate = (props) => {

    return (
        <div className={cx(styles['type1'], styles['wrapper'])}>
            <div className={styles['top-section']}>
                <span className={styles['img-wrapper']}>
                    {props[templateProperties.icon] ? <Image ImgSrc={props[templateProperties.icon]} /> : <img src={require('../../asset/img/miscellaneous/imagePlaceholder.png')} />}
                </span>
                <a onClick={() => openInNewTab(props[templateProperties.titleLink])} className={styles['title']}>{props[templateProperties.title]}</a>
            </div>
            <div className={styles['description-wrapper']}>
                <p className={styles['description']}>{props[templateProperties.description] ? trimText(props[templateProperties.description], 255) : ''}</p>
            </div>
            <div className={styles['action-panel']}>
                <a className={styles['linkBtn']} onClick={() => openInNewTab(props[templateProperties.buttonLink])}>{props[templateProperties.buttonText]}</a>
            </div>
        </div>
    );
}


//template type 2
export const TypeTwoTemplate = (props) => {
    const bannerImgStyle = {
        backgroundImage: `url(${props[templateProperties.background] ? props[templateProperties.background] : require('../../asset/img/miscellaneous/defaultBg.png')})`
    };

    return (
        <div className={cx(styles['type2'], styles['wrapper'])}>
            <div className={styles['top-section']}>
                <span className={styles['banner-bg']} style={bannerImgStyle}></span>
                <span className={styles['icon']}>
                    {props[templateProperties.icon] ? <Image ImgSrc={props[templateProperties.icon]} /> : <img src={require('../../asset/img/miscellaneous/imagePlaceholder.png')} />}
                </span>
                <h1 className={styles['title']}>{props[templateProperties.title]}</h1>
            </div>
            <div className={styles['body-section']}>
                <p className={styles['description']}>{props[templateProperties.description] ? trimText(props[templateProperties.description], 255) : ''}</p>
            </div>
            <div className={styles['action-panel']}>
                <a className={styles['linkBtn']} onClick={() => openInNewTab(props[templateProperties.buttonLink])}>{props[templateProperties.buttonText]}</a>
            </div>
        </div>
    );
}


// template type 3 
const ImgPlaceHolder = () => {
    return (
        <span className={styles['img-mask']}><img src={require('../../asset/img/miscellaneous/imagePlaceholder.png')} /></span>
    );
}
export const TypeThreeTemplate = (props) => {
    return (
        <div className={cx(styles['type3'], styles['wrapper'])}>
            {props[templateProperties.image] ? <Image ImgSrc={props[templateProperties.image]} ImagePlaceholder={ImgPlaceHolder} /> : <img src={require('../../asset/img/miscellaneous/imagePlaceholder.png')} />}
        </div>
    );
}


// template type 4 
export const TypeFourTemplate = (props) => {
    return (
        <div className={cx(styles['type4'], styles['wrapper'])}>
            <a onClick={() => openInNewTab(props[templateProperties.titleLink])} className={styles['title']}>{props[templateProperties.title]}</a>
            <p className={styles['description']}>{props[templateProperties.description] ? trimText(props[templateProperties.description], 255) : ''}</p>
        </div>
    );
}

// template type 5 
export const TypeFiveTemplate = (props) => {
    const bannerImgStyle = {
        backgroundImage: `url(${props[templateProperties.background] ? props[templateProperties.background] : require('../../asset/img/miscellaneous/defaultBg.png')})`
    };

    return (
        <div className={cx(styles['type5'], styles['wrapper'])}>
            <a onClick={() => openInNewTab(props[templateProperties.link])}>
                <div className={styles['top-section']}>
                    <span className={styles['background-img']} style={bannerImgStyle}></span>
                    <span className={styles['icon']}>
                        {props[templateProperties.icon] ? <Image ImgSrc={props[templateProperties.icon]} /> : <img className={styles['placeholder']} src={require('../../asset/img/miscellaneous/imagePlaceholder.png')} />}
                    </span>
                </div>
                <h3 className={styles['title']}>{props[templateProperties.title] ? trimText(props[templateProperties.title], 100) : ''}</h3>
                <div className={styles['meta-wrapper']}>
                    <span className={styles['author']}>{props[templateProperties.author]}</span>
                    <span className={styles['date']}>{props[templateProperties.date]}</span>
                </div>
            </a>
        </div>
    );
}


// template type 6
export const TypeSixTemplate = (props) => {
    const bannerImgStyle = {
        backgroundImage: `url(${props[templateProperties.background] ? props[templateProperties.background] : require('../../asset/img/miscellaneous/defaultBg.png')})`
    };

    return (
        <div className={cx(styles['type6'], styles['wrapper'])}>
            <div className={styles['container']}>
                <div className={styles['top-section']}>
                    <span className={styles['background-img']} style={bannerImgStyle}></span>
                    <span className={styles['icon']}>
                        {props[templateProperties.icon] ? <Image ImgSrc={props[templateProperties.icon]} /> : <img className={styles['placeholder']} src={require('../../asset/img/miscellaneous/imagePlaceholder.png')} />}
                    </span>
                </div>
                <h3 className={styles['title']}>{props[templateProperties.title] ? trimText(props[templateProperties.title], 100) : ''}</h3>
                <p className={styles['description']}>{props[templateProperties.description] ? trimText(props[templateProperties.description], 120) : ''}</p>
                <div className={styles['panel']}>
                    <a className={styles['button']} onClick={() => openInNewTab(props[templateProperties.buttonLink])}>{props[templateProperties.buttonText]}</a>
                </div>
            </div>
        </div>
    );
}


// template type 7
export const TypeSevenTemplate = (props) => {
    const isForThankYou = props.thankYou ? props.thankYou : false;

    const AvatarItem = (props) => {
        return (
            <div className={styles['avatar-item']}>
                <div className={styles['avatar-wrap']}>
                    {props.children}
                </div>

            </div>
        );
    }

    function renderAvatarList() {
        var avatars = [];
        var checkedForFphValue = false;
        const data = props[templateProperties.collections];
        let renderForFphValues = false;

        function formateTextDisplay(text: string): string {
            let textFragments = text.split(" ");
            let fragmentLength = textFragments.length;
            if (textFragments.length > 1) return `${textFragments[0].charAt(0).toUpperCase()}${textFragments[fragmentLength - 1].charAt(0).toUpperCase()}`;
            return textFragments[0].charAt(0).toUpperCase();
        }

        data.map(x => {
            if (!checkedForFphValue) {
                Object.keys(fphValuesDictionary).forEach(key => {
                    if (key.toLowerCase() === x.toLowerCase()) {
                        renderForFphValues = true;
                        checkedForFphValue = true;
                        return;
                    }
                    checkedForFphValue = true;
                });
            }

            if (renderForFphValues) {
                let avatar = (
                    <AvatarItem>
                        <span className={styles['tooltip']}>{x}</span>
                        <img src={fphValuesDictionary[x.toLowerCase()]} />
                    </AvatarItem>
                );
                avatars.push(avatar);
                return;
            }

            let avatar = (
                <AvatarItem>
                    {formateTextDisplay(x)}
                </AvatarItem>
            );
            avatars.push(avatar);

        });
        return avatars
    }

    return (
        <div className={cx(styles['type7'], styles['wrapper'])}>
            <a onClick={() => openInNewTab(props[templateProperties.link])}>
                <div className={styles['heading']}>
                    <span className={styles['label']}>To: </span>
                    <span className={styles['person']}>{props[templateProperties.to]}</span>
                </div>
                <div className={styles['description']}>{props[templateProperties.description] ? trimText(props[templateProperties.description], 150) : ''}</div>
                <div className={styles['avatar-collection']}>
                    {props[templateProperties.collections] && renderAvatarList()}
                </div>
            </a>
        </div>
    );
}