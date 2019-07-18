import * as React from 'react';
import styles from './ContentDisplayWebpart.module.scss';
import { IContentDisplayWebpartProps } from './IContentDisplayWebpartProps';
import Grid from '../components/templateLayouts/GridView/GridView';
import LayoutService, { ILayoutService } from '../services/LayoutService';
import GridView from '../components/templateLayouts/GridView/GridView';
import ListView from '../components/templateLayouts/ListView/ListView';
import MansoryView from '../components/templateLayouts/MansoryView/MansoryView';
import WithListService from './HOC/WithListService';
import WithTemplateFormatting from './HOC/WithTemplateFormatting';

export interface IContentDisplayWebpartState {
  listType: number;
}

class ContentDisplayWebpart extends React.Component<IContentDisplayWebpartProps, IContentDisplayWebpartState> {

  private _LayoutService: ILayoutService;

  constructor(props: IContentDisplayWebpartProps) {
    super(props);
    this.onPrevPage = this.onPrevPage.bind(this);
    this.onNextPage = this.onNextPage.bind(this);
    this._LayoutService = new LayoutService();
    this.state = {
      listType: 0
    }
  }

  public async componentDidMount() {
    let listType = await this.props.getListType();
    this.setState({
      listType: listType.BaseType
    })
  }

  public onPrevPage(): void {
    const { onPrevPage, fetchResult } = this.props;
    onPrevPage(fetchResult.currentPage - 1);
  }

  public onNextPage(): void {
    const { onNextPage, fetchResult } = this.props;
    onNextPage(true, fetchResult.currentPage + 1);
  }

  public render(): React.ReactElement<IContentDisplayWebpartProps> {
    const { fetchResult,isFetching } = this.props;
    var layout = this._LayoutService.getLayoutById(this.props.layouts);
    return (
      <div className={styles['webpart-wrapper']}>
        {this.props.enablePaging && fetchResult.Items.length !== 0 && <div className={styles['pagination-panel']}>
          {<button onClick={this.onPrevPage} disabled={(fetchResult.currentPage === 1 || isFetching)}><svg xmlns="http://www.w3.org/2000/svg" height="30" width="30" viewBox="0 0 30 30">
            <g>
              <path id="path1" transform="rotate(0,15,15) translate(6.8657021151385,0) scale(0.937617193654483,0.937617193654483)  " fill="#004B75" d="M15.854048,0L17.272997,1.4100033 2.8199543,15.950011 17.351,30.587004 15.932051,31.996001 0,15.949004z" />
            </g>
          </svg></button>}
          {<span className={styles['pagination-range']}>{fetchResult.pageRangeDisplay}</span>}
          {<button onClick={this.onNextPage} disabled={(!fetchResult.hasMore || isFetching)}><svg xmlns="http://www.w3.org/2000/svg" height="30" width="30" viewBox="0 0 30 30">
            <g>
              <path id="path1" transform="rotate(0,15,15) translate(6.86570122095706,0) scale(0.937617193654483,0.937617193654483)  " fill="#004B75" d="M1.4200482,0L17.351001,16.046996 1.4980513,31.996001 0.078979631,30.585997 14.531046,16.046019 0,1.4089964z" />
            </g>
          </svg></button>}
        </div>}
        {this.getLayout(layout.Name)}
      </div>
    );
  }

  private getLayout(layoutName: string): JSX.Element {
    const { bindings, hasBindings, template, configuredItems, isFetching, listType, listName } = this.props;
    let shouldSkipBinding = (listType.BaseType === 1 && listName.toLowerCase() !== 'site pages');
    switch (layoutName) {
      case 'Grid':
        return <GridView shouldIgnoreBinding={shouldSkipBinding} bindings={bindings} hasBindings={hasBindings} template={template} configuredItems={configuredItems} isFetching={isFetching} />
      case 'List':
        return <ListView shouldIgnoreBinding={shouldSkipBinding} bindings={bindings} hasBindings={hasBindings} template={template} configuredItems={configuredItems} isFetching={isFetching} />
      case 'Mansory':
        return <MansoryView shouldIgnoreBinding={shouldSkipBinding} bindings={bindings} hasBindings={hasBindings} template={template} configuredItems={configuredItems} isFetching={isFetching} />

    }
  }
}


export default WithListService(WithTemplateFormatting(ContentDisplayWebpart))