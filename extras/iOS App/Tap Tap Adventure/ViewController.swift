//
//  ViewController.swift
//  Tap Tap Adventure
//
//  Created by Flavius on 2015-01-07.
//  Copyright (c) 2015 Flaris. All rights reserved.
//

import UIKit
import iAd
import StoreKit

class ViewController: UIViewController, UIWebViewDelegate, ADBannerViewDelegate, SKProductsRequestDelegate, SKPaymentTransactionObserver, UIAlertViewDelegate {

    var loadingIndicator = UIActivityIndicatorView()
    var adsRemoved = false
    let product_id = "taptap25111998removeads"
    var requestObj = NSURLRequest(URL: NSURL(string: "http://taptapadventure.com")!)
    
    @IBOutlet weak var webView: UIWebView!
    @IBOutlet weak var adView: ADBannerView!
    @IBOutlet weak var removeAdsButton: UIButton!
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        webView.opaque = false
        adsRemoved = NSUserDefaults.standardUserDefaults().boolForKey("didRemoveAds")
        webView.delegate = self
        webView.mediaPlaybackRequiresUserAction = false
        adView.delegate = self
        webView.backgroundColor = UIColor.blackColor()
        //load indicator
        loadingIndicator = UIActivityIndicatorView(frame: CGRectMake(view.frame.width / 2, view.frame.height / 2, 0, 0))
        loadingIndicator.transform = CGAffineTransformMakeScale(2, 2);
        loadingIndicator.startAnimating()
        webView.addSubview(loadingIndicator)
        
        
           removeAds()
        
        
        
    }
    
    func canMakePurchases() -> Bool
    {
        return SKPaymentQueue.canMakePayments()
    }
    
    func fetchAvailableProducts() {
        let productID:NSSet = NSSet(object: product_id);
        let productsRequest:SKProductsRequest = SKProductsRequest(productIdentifiers: productID as! Set<String>)
        productsRequest.delegate = self;
        productsRequest.start();
    }
    
    
    @IBAction func buyConsumable(sender: AnyObject) {

        let alert = UIAlertView(title: "Remove Advertisements", message: "Removes the advertisements.", delegate: self, cancelButtonTitle: "Nope", otherButtonTitles: "Restore Purchases", "Purchase")
        alert.show()
    }

    // Helper Methods
    
    func buyProduct(product: SKProduct){
        print("Sending the Payment Request to Apple");
        let payment = SKPayment(product: product)
        
        SKPaymentQueue.defaultQueue().addPayment(payment)

    }
    
    
    // Delegate Methods for IAP
    
    func productsRequest (request: SKProductsRequest, didReceiveResponse response: SKProductsResponse) {
        print("got the request from Apple")
        let count : Int = response.products.count
        if (count>0) {
            var validProducts = response.products
            let validProduct: SKProduct = response.products[0] 
            if (validProduct.productIdentifier == product_id) {
                print(validProduct.localizedTitle)
                print(validProduct.localizedDescription)
                print(validProduct.price)
                buyProduct(validProduct);
            } else {
                print(validProduct.productIdentifier)
            }
        } else {
            print("nothing")
        }
    }
    
    
    func request(request: SKRequest, didFailWithError error: NSError) {
        print("Has failed with error.");
    }
    
    @IBAction func refreshView(sender: AnyObject) {

        webView.reload()
        
    }

    func removeAds() {
        adsRemoved = true
        
        webView.reload()
        NSUserDefaults.standardUserDefaults().setBool(adsRemoved, forKey: "didRemoveAds")
        NSUserDefaults.standardUserDefaults().synchronize()
        view.backgroundColor = UIColor.blackColor()
        refreshViewAfterPurchase()
    }

    
    func refreshViewAfterPurchase() {
        if adsRemoved == true {
            removeAdsButton.removeFromSuperview()
            adView.removeFromSuperview()
        }
    }
    
    func paymentQueue(queue: SKPaymentQueue, updatedTransactions transactions: [SKPaymentTransaction])    {
        print("Received Payment Transaction Response from Apple");
        
        for transaction:AnyObject in transactions {
            if let trans:SKPaymentTransaction = transaction as? SKPaymentTransaction{
                switch trans.transactionState {
                case .Purchased:
                    print("Product Purchased");
                    SKPaymentQueue.defaultQueue().finishTransaction(transaction as! SKPaymentTransaction)
                    removeAds()
                    break;
                case .Failed:
                    print("Purchased Failed");
                    SKPaymentQueue.defaultQueue().finishTransaction(transaction as! SKPaymentTransaction)
                    break;
                    
                case .Restored:
                    SKPaymentQueue.defaultQueue().finishTransaction(transaction as! SKPaymentTransaction)
                    print("Purchase Restored")
                    removeAds()
                    break;
                    
                default:
                    break;
                }
            }
        }
        
    }
    
    
    func webView(webView: UIWebView, shouldStartLoadWithRequest request: NSURLRequest, navigationType: UIWebViewNavigationType) -> Bool {
        webView.backgroundColor = UIColor.blackColor()
        
        return true
    }
    
    func webViewDidStartLoad(webView: UIWebView) {
        
        
        loadingIndicator.startAnimating()
        
    }
    
    func webViewDidFinishLoad(webView: UIWebView) {
        
        loadingIndicator.stopAnimating()
        webView.scrollView.scrollEnabled = false
        
    }
    
    
    func bannerViewDidLoadAd(banner: ADBannerView!) {
        UIView.beginAnimations(nil, context: nil)
        UIView.setAnimationDuration(1)
        banner.alpha = 1
        UIView.commitAnimations()
    }
    
    func bannerView(banner: ADBannerView!, didFailToReceiveAdWithError error: NSError!) {
        UIView.beginAnimations(nil, context: nil)
        UIView.setAnimationDuration(1)
        banner.alpha = 0
        UIView.commitAnimations()
    }
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func alertView(alertView: UIAlertView, clickedButtonAtIndex buttonIndex: Int) {
        switch (buttonIndex) {
            case 1:
                SKPaymentQueue.defaultQueue().restoreCompletedTransactions()
                print("Restoring Purchases")
            break;
            
            case 2:
                print("Initializing purcahses")
                print("About to fetch the products");
                // We check that we are allow to make the purchase.
                if (SKPaymentQueue.canMakePayments()) {
                    let productID:NSSet = NSSet(object: product_id);
                    let productsRequest:SKProductsRequest = SKProductsRequest(productIdentifiers: productID as! Set<String>);
                    productsRequest.delegate = self;
                    productsRequest.start();
                    print("Fething Products");
                } else {
                    print("can't make purchases");
                }
                

            break;
            
            default:
                alertView.dismissWithClickedButtonIndex(buttonIndex, animated: true)
            break;
        }
    }
    override func shouldAutorotate() -> Bool {
        return true
    }
    

  
}
