package com.honeybadger

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.asLiveData
import androidx.lifecycle.lifecycleScope
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import it.airgap.beaconsdk.blockchain.substrate.data.SubstrateAccount
import it.airgap.beaconsdk.blockchain.substrate.data.SubstrateNetwork
import it.airgap.beaconsdk.blockchain.substrate.message.request.PermissionSubstrateRequest
import it.airgap.beaconsdk.blockchain.substrate.message.response.PermissionSubstrateResponse
import it.airgap.beaconsdk.blockchain.substrate.substrate
import it.airgap.beaconsdk.blockchain.tezos.data.TezosAccount
import it.airgap.beaconsdk.blockchain.tezos.data.TezosNetwork
import it.airgap.beaconsdk.blockchain.tezos.message.request.PermissionTezosRequest
import it.airgap.beaconsdk.blockchain.tezos.message.response.PermissionTezosResponse
import it.airgap.beaconsdk.blockchain.tezos.tezos
import it.airgap.beaconsdk.client.wallet.BeaconWalletClient
import it.airgap.beaconsdk.core.data.BeaconError
import it.airgap.beaconsdk.core.data.P2pPeer
import it.airgap.beaconsdk.core.message.BeaconRequest
import it.airgap.beaconsdk.core.message.ErrorBeaconResponse
import it.airgap.beaconsdk.transport.p2p.matrix.p2pMatrix
import it.airgap.beaconsdk.core.data.Permission
import it.airgap.beaconsdk.core.data.AppMetadata
import it.airgap.beaconsdk.core.data.Peer
import kotlinx.coroutines.*
import android.util.Log
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleOwner
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.google.gson.Gson
import com.google.gson.annotations.SerializedName
import kotlinx.serialization.*
import kotlinx.serialization.json.Json
import kotlinx.serialization.encodeToString

data class Param(val type: String= "", val data: String= "")

class BeaconBridgeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "BeaconBridge"
    lateinit var beaconWallet: BeaconWalletClient
    private val rContext: ReactApplicationContext = reactContext
    private var awaitingRequest: BeaconRequest? = null
    private var coroutineScope = CoroutineScope(Dispatchers.Main)

    private fun sendEvent(reactContext: ReactContext, eventName: String, params: Param) {
        val stringParam = Gson().toJson(params)
        reactContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        .emit(eventName, stringParam)
    }   

    @ReactMethod fun startBeacon() {
        coroutineScope.launch {
            try {
                createWalletClient()
                listenForRequests()
                val param = Param("start_beacon", "success")
                sendEvent(rContext, "onSuccess", param)
            } catch (e: Exception) {
                val error = Json.encodeToString(e.message)
                Log.d("start",  error)
                // onError(e)
            }
        }
    }

    suspend fun createWalletClient() {
        beaconWallet = BeaconWalletClient("Galleon Mobile") {
            support(substrate(), tezos()) // set support for Substrate and Tezos blockchains
            use(p2pMatrix()) // use Matrix to communicate with the Beacon network
        }
    }

    private fun listenForRequests() {
        beaconWallet.connect().asLiveData().observe(this) { result ->
            result.getOrNull()?.let { onBeaconRequest(it) }
            result.exceptionOrNull()?.let { onError(it) }
        }
    }

    fun onBeaconRequest(request: BeaconRequest) {
        awaitingRequest = request;
    }

    fun onError(e: Throwable) {
        Log.d("listenForRequests", "failed")
        e.printStackTrace()
    }

    fun substrateAccount(network: SubstrateNetwork) = SubstrateAccount(
        "f4c6095213a2f6d09464ed882b12d6024d20f7170c3b8bd5c1b071e4b00ced72" /* TODO: change me */,
        "16XwWkdUqFXFY1tJNf1Q6fGgxQnGYUS6M95wPcrbp2sjjuoC" /* TODO: change me */,
        network,
    )

    fun tezosAccount(network: TezosNetwork, publicKey: String, address: String) = TezosAccount(
        publicKey,
        address,
        network
    )

    @ReactMethod
    fun sendResponse(publicKey: String, address: String) {
        val request = awaitingRequest ?: return
        val response = when (request) {
            is PermissionSubstrateRequest -> PermissionSubstrateResponse.from(request, request.networks.map { substrateAccount(it) })
            is PermissionTezosRequest -> PermissionTezosResponse.from(request, tezosAccount(request.network, publicKey, address))
            else -> ErrorBeaconResponse.from(request, BeaconError.Aborted)
        }
        coroutineScope.launch {
            try {
                beaconWallet.respond(response)
                val param = Param("permission_success", "");
                sendEvent(rContext, "onSuccess", param)
            } catch (e: Exception) {
                val param = Param("", "Failed to send the response");
                sendEvent(rContext, "onError", param)
            }
        }  
    }

    @ReactMethod fun addPeer(peerId: String, name: String, publicKey: String, relayServer: String, version: String) {
        val dApp = P2pPeer(
            id = peerId,
            name = name,
            publicKey = publicKey,
            relayServer = relayServer,
            version = version,
        )

        coroutineScope.launch {
            try {
                // connect to a new peer
                beaconWallet.addPeers(dApp)
            } catch (e: Exception) {
                e.printStackTrace()
                // Todo `event`
            }
        }
    }

    fun handlePermissions(result: List<Permission>) {
        val param = Param("get_permissions",Json.encodeToString(result));
        sendEvent(rContext, "onSuccess", param)
    }

    @ReactMethod
    fun getPermissions() {
        coroutineScope.launch {
            try {
                val data = beaconWallet.getPermissions()
                handlePermissions(data)
            } catch (e: Exception) {

            }
        }  
    }

    fun handlehandlePeers(result: List<Peer>) {
        val param = Param("get_peers",Json.encodeToString(result));
        sendEvent(rContext, "onSuccess", param)
    }

    @ReactMethod
    fun getPeers() {
        coroutineScope.launch {
            try {
                val data = beaconWallet.getPeers()
                handlehandlePeers(data)
            } catch (e: Exception) {

            }
        }  
    }

    fun handleAppMetadata(result: List<AppMetadata>) {
        val param = Param("get_app_metadata",Json.encodeToString(result));
        sendEvent(rContext, "onSuccess", param)
    }

    @ReactMethod
    fun getAppMetadata() {
        coroutineScope.launch {
            try {
                val data = beaconWallet.getAppMetadata()
                handleAppMetadata(data)
            } catch (e: Exception) {

            }
        }  
    }

    @ReactMethod
    fun removePermissions() {
        coroutineScope.launch {
            try {
                val data = beaconWallet.removeAllPermissions()
                // handleAppMetadata(data)
            } catch (e: Exception) {

            }
        }  
    }
    @ReactMethod
    fun removePeers() {
        coroutineScope.launch {
            try {
                val data = beaconWallet.removeAllPeers()
                // handleAppMetadata(data)
            } catch (e: Exception) {

            }
        }  
    }

    @ReactMethod
    fun removeAppMetadata() {
        coroutineScope.launch {
            try {
                val data = beaconWallet.removeAllAppMetadata()
                // handleAppMetadata(data)
            } catch (e: Exception) {

            }
        }  
    }

    @ReactMethod
    fun addListener(eventName: String) {
        // Set up any upstream listeners or background tasks as necessary
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // Remove upstream listeners, stop unnecessary background tasks
    }

//    override fun getLifecycle(): Lifecycle {
//        TODO("Not yet implemented")
//    }
}

private fun Any.observe(beaconBridgeModule: BeaconBridgeModule, function: (t: Result<BeaconRequest>) -> Unit) {

}

