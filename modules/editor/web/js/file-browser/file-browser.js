/**
 * Copyright (c) 2016, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

define(['jquery', 'backbone', 'lodash', 'tree_view', /** void module - jquery plugin **/ 'js_tree'], function ( $, Backbone, _, TreeMod) {

    var FileBrowser = Backbone.View.extend({

        initialize: function (config) {
            var errMsg;
            if (!_.has(config, 'container')) {
                errMsg = 'unable to find configuration for container';
                log.error(errMsg);
                throw errMsg;
            }
            var container = $(_.get(config, 'container'));
            // check whether container element exists in dom
            if (!container.length > 0) {
                errMsg = 'unable to find container for file browser with selector: ' + _.get(config, 'container');
                log.error(errMsg);
                throw errMsg;
            }
            this._$parent_el = container;

            if(!_.has(config, 'application')){
                log.error('Cannot init file browser. config: application not found.')
            }
            this.application = _.get(config, 'application');
            this._options = config;
            this.workspaceServiceURL = _.get(this._options, 'application.config.services.workspace.endpoint');
            this._isActive = false;
        },

        render: function () {
            var self = this;
            this._$parent_el
                .jstree({
                    'core' : {
                        'data' : {
                            'url': function (node) {
                                if(node.id === '#') {
                                    return self.workspaceServiceURL + "/root";
                                }
                                else {
                                    return self.workspaceServiceURL + "/list?path=" + btoa(node.id);
                                }
                            },
                            'dataType': "json",
                            'data' : function (node) {
                                return { 'id' : node.id };
                            }
                        },
                        'multiple' : false,
                        'check_callback' : false,
                        'force_text' : true,
                        'themes' : {
                            'responsive' : false,
                            'variant' : 'small',
                            'stripes' : true
                        }
                    }
                })
                .on('changed.jstree', function (e, data) {
                    if(data && data.selected && data.selected.length) {
                        self.selected = data.selected[0];
                    }
                    else {
                        self.selected = false;
                    }
                });
            return this;
        }
    });

    return FileBrowser;

});