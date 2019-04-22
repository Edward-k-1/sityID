<?php
/**
 * Displayin form when user is not logined
 */
?>
<div ng-if="!isAuthenticated()" >
    <div ng-controller="LoginCtrl""></div>
</div>
<?php
/**
* Displayin new when user is logined
*/
?>
<div class="loading-date-message" ng-controller="DataLoaderCtrl" ng-if="isAuthenticated()&&!loading.isDataLoaded">

    <div class="popup-loader" style="display: " >
        <div class="content-popup-loader">
            <md-progress-circular  md-diameter="96"></md-progress-circular>
            </div></div>


</div>

<div ng-if="isAuthenticated()&&loading.isDataLoaded" class="main-page">
<ng-include src="'app/templates/mainpage-header.tpl.html'"></ng-include>

    <div id="main-viewport">
        <div id="main-menu-container" ng-mouseenter="showMenu()" ng-mouseleave="hideMenu()">
            <div class="main-menu">
                <ng-include src="'app/templates/mainpage-acordeon.tpl.html'"></ng-include>
            </div>
            <div class="main-menu-button" ng-click="showMenu()">
                <span></span>
            </div>

        </div>
        <div id="page-container">
            <ng-include src="'app/templates/mainpage-content.tpl.html'"></ng-include>
        </div>
    </div>
<!--    <ml-sidebar-left>-->
<!--        <ml-sidebar-panel-left size="260">-->
<!--            <ng-include src="'app/templates/mainpage-acordeon.tpl.html'"></ng-include>-->
<!---->
<!--        </ml-sidebar-panel-left>-->
<!--        <ml-sidebar-content-left>-->
<!--            <ml-sidebar-bottom>-->
<!--                <ml-sidebar-panel-bottom size="150">-->
<!---->
<!--                </ml-sidebar-panel-bottom>-->
<!--                <ml-sidebar-content-bottom>-->
<!--                    <ng-include src="'app/templates/mainpage-content.tpl.html'"></ng-include>-->
<!---->
<!--                </ml-sidebar-content-bottom>-->
<!--            </ml-sidebar-bottom>-->
<!--        </ml-sidebar-content-left>-->
<!--    </ml-sidebar-left>-->
    <ng-include src="'app/templates/mainpage-footer.tpl.html'"></ng-include>
</div>

