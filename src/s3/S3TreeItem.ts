/* eslint-disable @typescript-eslint/naming-convention */
import * as vscode from 'vscode';


/**
 * S3 노드 ( 트리노드 )
 */
export class S3TreeItem extends vscode.TreeItem {

    public IsFav: boolean = false;
    public TreeItemType: TreeItemType;
    public Text: string;
    public Bucket: string | undefined;
    public Shortcut: string | undefined;

    public Parent: S3TreeItem | undefined;
    public Children: S3TreeItem[] = [];

    public IsHidden: boolean = false;


    constructor( text: string, treeItemType: TreeItemType ) {
        super( text );

        this.Text = text;
        this.TreeItemType = treeItemType;

        this.refreshUI();
    }

    /**
     * 노드의 아이콘 설정 및 컨텍스트 설정
     */
    public refreshUI() {

        // https://code.visualstudio.com/api/references/icons-in-labels#icon-listing

        if ( this.TreeItemType === TreeItemType.Bucket ) {
            this.iconPath = new vscode.ThemeIcon( 'package' );
            this.contextValue = "Bucket"
        }
        else if ( this.TreeItemType === TreeItemType.Shortcut ) {
            this.iconPath = new vscode.ThemeIcon( 'file-symlink-directory' );
            this.contextValue = "Shortcut"
        }
        else {
            this.iconPath = new vscode.ThemeIcon( 'circle-outline' );
            this.contextValue = "Other"
        }
    }

    public IsAnyChidrenFav() {
        return this.IsAnyChidrenFavInternal( this );
    }

    public IsAnyChidrenFavInternal( node: S3TreeItem ): boolean {
        for ( var n of node.Children ) {
            if ( n.IsFav ) {
                return true;
            }
            else if ( n.Children.length > 0 ) {
                return this.IsAnyChidrenFavInternal( n );
            }
        }

        return false;
    }

    public IsFilterStringMatch( FilterString: string ) {
        if ( this.Text.includes( FilterString ) ) {
            return true;
        }

        if ( this.IsFilterStringMatchAnyChildren( this, FilterString ) ) {
            return true;
        }

        return false;
    }

    public IsFilterStringMatchAnyChildren( node: S3TreeItem, FilterString: string ): boolean {
        for ( var n of node.Children ) {
            if ( n.Text.includes( FilterString ) ) {
                return true;
            }
            else if ( n.Children.length > 0 ) {
                return this.IsFilterStringMatchAnyChildren( n, FilterString );
            }
        }

        return false;
    }
}

/**
 * S3 노드 타입
 */
export enum TreeItemType {
    Bucket = 1,
    Shortcut = 2,
}