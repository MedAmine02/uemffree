// // lib/services/stream_chat_service.dart
// import 'package:http/http.dart' as http;
// import 'dart:convert';

// import 'package:stream_chat_flutter/stream_chat_flutter.dart';

// class StreamChatService {
//   static final StreamChatClient client = StreamChatClient('your-api-key');

//   static Future<void> connectUser(String userId) async {
//     final token = await yourBackendTokenRetrievalLogic(userId);

//     await client.connectUser(User(id: userId), token);
//   }

//   static Future<String> yourBackendTokenRetrievalLogic(String userId) async {
//     final response = await http.post(
//       Uri.parse('http://192.168.100.10:3000/generate-token'),
//       body: {'userId': userId},
//     );

//     if (response.statusCode == 200) {
//       final data = json.decode(response.body);
//       return data['token'];
//     } else {
//       throw Exception('Failed to retrieve Stream Chat token');
//     }
//   }
// }
