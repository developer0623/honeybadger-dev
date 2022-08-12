//
//  BeaconBridge.swift
//  honeybadger
//
//  Created by admin on 8/1/22.
//

import Foundation
import BeaconCore
import BeaconClientWallet
import BeaconBlockchainTezos
import BeaconBlockchainSubstrate
import BeaconTransportP2PMatrix

@objc(BeaconBridge)
class BeaconBridge: RCTEventEmitter {
//  private var awaitingRequest
  @Published private(set) var beaconRequest: String? = nil
  
  override static func moduleName() -> String! {
    return "BeaconBridge";
  }
  
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  override func supportedEvents() -> [String]! {
    return ["onMessage", "onError", "onSuccess"]
  }
  
  private var beaconClient: Beacon.WalletClient?
  
  let dApp = Beacon.P2PPeer(
    id: "0b02d44c-de33-b5ab-7730-ff8e62f61869", /* TODO: change me */
    name: "My dApp",
    publicKey: "6c7870aa1e42477fd7c2baaf4763bd826971e470772f71a0a388c1763de3ea1e", /* TODO: change me */
    relayServer: "beacon-node-1.sky.papers.tech", /* TODO: change me */
    version: "2" /* TODO: change me */
  )

  func substrateAccount(network: Substrate.Network) throws -> Substrate.Account {
      try Substrate.Account(
          publicKey: "f4c6095213a2f6d09464ed882b12d6024d20f7170c3b8bd5c1b071e4b00ced72", /* TODO: change me */
          address: "16XwWkdUqFXFY1tJNf1Q6fGgxQnGYUS6M95wPcrbp2sjjuoC", /* TODO: change me */
          network: network
      )
  }

  func tezosAccount(network: Tezos.Network) throws -> Tezos.Account {
    try Tezos.Account(
          publicKey: "9ae0875d510904b0b15d251d8def1f5f3353e9799841c0ed6d7ac718f04459a0", /* TODO: change me */
          address: "tz1SkbBZg15BXPRkYCrSzhY6rq4tKGtpUSWv", /* TODO: change me */
          network: network
      )
  }
  
  @objc
  func startBeacon() {
    createBeaconWallet { result in
        guard case .success(_) = result else {
            return
        }

        self.subscribeToRequests { result in
            guard case .success(_) = result else {
                return
            }

            self.connectToDApp { result in
                guard case .success(_) = result else {
                    return
                }
            }
        }
    }
  }
  
  func createBeaconWallet(completion: @escaping (Result<(), Error>) -> ()) {
    do {
      Beacon.WalletClient.create(
        with: .init(
          name: "Galleon Mobile",
          blockchains: [Substrate.factory, Tezos.factory],
          connections: [try Transport.P2P.Matrix.connection()]
        )
      ) { result in
        switch result {
        case let .success(client):
          self.beaconClient = client
          completion(.success(()))
        case let .failure(error):
          completion(.failure(error))
        }
      }
    } catch {
      completion(.failure(error))
    }
  }
  
  func subscribeToRequests(completion: @escaping (Result<(), Error>) -> ()) {
    self.beaconClient?.connect { result in
      switch result {
      case .success(_):
        self.beaconClient?.listen(onRequest: self.onSubstrateRequest)
          self.beaconClient?.listen(onRequest: self.onTezosRequest)
          completion(.success(()))
      case let .failure(error):
        completion(.failure(error))
      }
    }
  }
  
  func connectToDApp(completion: @escaping (Result<(), Error>) -> ()) {
    beaconClient?.add([.p2p(dApp)]) { result in
      switch result {
      case .success(_):
        completion(.success(()))
      case let .failure(error):
        completion(.failure(error))
      }
    }
  }

  func onSubstrateRequest(_ request: Result<BeaconRequest<Substrate>, Beacon.Error>) {
    do {
      let request = try request.get()
      let response = try response(from: request)

      beaconClient?.respond(with: response) { result in
        switch result {
        case .success(_):
          print("Response sent")
        case let .failure(error):
          print(error)
        }
      }
    } catch {
      print(error)
    }
  }

  func response(from request: BeaconRequest<Substrate>) throws -> BeaconResponse<Substrate> {
    switch request {
    case let .permission(content):
      let accounts = try content.networks.map { try substrateAccount(network: $0) }
      return .permission(PermissionSubstrateResponse(from: content, accounts: accounts))
    case let .blockchain(blockchain):
      return .error(ErrorBeaconResponse(from: blockchain, errorType: .aborted))
    }
  }

  func onTezosRequest(_ request: Result<BeaconRequest<Tezos>, Beacon.Error>) {
    do {
      let request = try request.get()
      let response = try response(from: request)

      beaconClient?.respond(with: response) { result in
        switch result {
        case .success(_):
          print("Response sent")
        case let .failure(error):
          print(error)
        }
      }
    } catch {
      print(error)
    }
  }

  func response(from request: BeaconRequest<Tezos>) throws -> BeaconResponse<Tezos> {
    switch request {
    case let .permission(content):
      let account = try tezosAccount(network: content.network)
      return .permission(PermissionTezosResponse(from: content, account: account))
    case let .blockchain(blockchain):
      return .error(ErrorBeaconResponse(from: blockchain, errorType: .aborted))
    }
  }
  
  @objc
  func addPeer(_ peerId: String, name: String, publicKey: String, relayServer: String, version: String) {
    var peer: Beacon.P2PPeer {
      Beacon.P2PPeer(id: peerId, name: name, publicKey: publicKey, relayServer: relayServer, version: version)
    }
    self.beaconClient?.add([.p2p(peer)]) { result in
      switch result {
      case .success(_):
        print("Peer added")
      case let .failure(error):
        print("Could not add the peer, got error: \(error)")
        self.sendEvent(withName: "onError", body: ["ADD_PEER_ERROR", "Could not add the peer, got error: \(error)"])
      }
    }
  }
  
  func handlePermissions(result: Result<[BeaconCore.AnyPermission], Beacon.Error>) {
    let encoder = JSONEncoder()
    encoder.outputFormatting = .prettyPrinted

    let data = try? encoder.encode(try? result.get())

    self.sendEvent(withName: "onSuccess", body: ["type": "get_permissions", "data": data.flatMap { String(data: $0, encoding: .utf8) }])
  }
  
  @objc
  func getPermissions() {
    self.beaconClient?.getPermissions(completion: self.handlePermissions)
  }
  
  func handlePeers(result: Result<[Beacon.Peer], Beacon.Error>) {
    let encoder = JSONEncoder()
    encoder.outputFormatting = .prettyPrinted

    let data = try? encoder.encode(try? result.get())

    self.sendEvent(withName: "onSuccess", body: ["type": "get_peers", "data": data.flatMap { String(data: $0, encoding: .utf8) }])
  }
  
  @objc
  func getPeers() {
    self.beaconClient?.getPeers(completion: self.handlePeers)
  }
  
  func handleAppMetadata(result: Result<[BeaconCore.AnyAppMetadata], Beacon.Error>) {
    let encoder = JSONEncoder()
    encoder.outputFormatting = .prettyPrinted
    let data = try? encoder.encode(try? result.get())
    
    self.sendEvent(withName: "onSuccess", body: ["type": "get_app_metadata", "data": data.flatMap { String(data: $0, encoding: .utf8) }])
  }
  
  @objc
  func getAppMetadata() {
    self.beaconClient?.getAppMetadata(completion: self.handleAppMetadata)
  }
  
  @objc
  func removePermissions() {
    self.beaconClient?.removeAllPermissions() { result in
      switch result {
      case .success(_):
        print("Remove Permissions Success")
      case let .failure(error):
        print("Could not remove permissions, got error: \(error)")
      }
    }
  }
  
  @objc
  func removePeers() {
    self.beaconClient?.removeAllPeers() { result in
      switch result {
        case .success(_):
          print("Remove Peers Success")
        case let .failure(error):
          print("Could not remove peers, got error: \(error)")
      }
    }
  }

  @objc
  func removeAppMetadata() {
    self.beaconClient?.removeAllMetadata() { result in
      switch result {
        case .success(_):
          print("Remove AppMetadata Success")
        case let .failure(error):
          print("Could not remove metadata, got error: \(error)")
      }
    }
  }
  
  @objc
  func sendResponse(_ payload: String) {
  }
  
}
