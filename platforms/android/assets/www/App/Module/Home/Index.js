var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'chitu', 'knockout', 'Services/Service', 'Services/Home', 'Core/Carousel'], function (require, exports, chitu, ko, services, home, Carousel) {
    chitu.Utility.loadjs(['UI/PromotionLabel', 'css!sc/Home/Index']);
    var IndexPage = (function (_super) {
        __extends(IndexPage, _super);
        function IndexPage() {
            _super.call(this);
            this.homeProductQueryArguments = {
                pageIndex: 0
            };
            this.model = {
                name: ko.observable(''),
                brands: ko.observableArray(),
                advertItems: ko.observableArray(),
                homeProducts: ko.observableArray(),
                pay: function () {
                    window.alipay.pay({
                        tradeNo: 'g1239aaga1142f',
                        subject: "测试标题",
                        body: "我是测试内容",
                        price: 0.01,
                        notifyUrl: "http://your.server.notify.url"
                    }, function (successResults) {
                        alert(successResults);
                    }, function (errorResults) {
                        alert(errorResults);
                    });
                }
            };
            this.viewChanged.add(this.page_viewChanged);
        }
        IndexPage.prototype.page_load = function (sender, args) {
            var page;
            if (sender instanceof IndexPage)
                page = sender;
            else
                page = (sender.page);
            var result = home.homeProducts(page.homeProductQueryArguments.pageIndex)
                .done(function (homeProducts) {
                for (var i = 0; i < homeProducts.length; i++) {
                    homeProducts[i].Url = '#Home_Product_' + homeProducts[i].ProductId;
                    page.model.homeProducts.push(homeProducts[i]);
                }
                page.homeProductQueryArguments.pageIndex++;
                args.enableScrollLoad = (homeProducts.length == services.defaultPageSize);
                $(page.container.element).find('.page-loading').hide();
            });
            return result;
        };
        IndexPage.prototype.page_viewChanged = function (sender, args) {
            ko.applyBindings(sender.model, sender.element);
            var scroll_view = sender.findControl('products');
            scroll_view.scrollLoad = sender.page_load;
            var items_deferred = home.advertItems().done(function (advertItems) {
                for (var i = 0; i < advertItems.length; i++) {
                    advertItems[i].index = i;
                    advertItems[i].LinkUrl = advertItems[i].LinkUrl;
                    sender.model.advertItems.push(advertItems[i]);
                }
                var c = new Carousel($(sender.element).find('[name="ad-swiper"]')[0]);
                scroll_view.scroll.add(function (sender, e) {
                    c.pause = e.scrollTop < 0;
                });
            });
        };
        return IndexPage;
    })(chitu.Page);
    return IndexPage;
});