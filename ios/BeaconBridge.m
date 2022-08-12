//
//  BeaconBridge.m
//  honeybadger
//
//  Created by admin on 8/1/22.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"
#import "React/RCTEventEmitter.h"

@interface RCT_EXTERN_MODULE(BeaconBridge, RCTEventEmitter)
  RCT_EXTERN_METHOD(startBeacon)
  RCT_EXTERN_METHOD(addPeer:(NSString *)peerId name:(NSString *)name publicKey:(NSString *)publicKey relayServer:(NSString *)relayServer version:(NSString *)version)
//  RCT_EXTERN_METHOD(sendResponse:(NSString *)payload)
  RCT_EXTERN_METHOD(removePermissions)
  RCT_EXTERN_METHOD(removePeers)
  RCT_EXTERN_METHOD(removeAppMetadata)
  RCT_EXTERN_METHOD(getPermissions)
  RCT_EXTERN_METHOD(getPeers)
  RCT_EXTERN_METHOD(getAppMetadata)
@end
