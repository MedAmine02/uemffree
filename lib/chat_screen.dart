// import 'package:flutter/material.dart';
// import 'package:stream_chat_flutter/stream_chat_flutter.dart';
// import 'package:uemffree/services/stream_chat_service.dart';

// class ChatScreen extends StatelessWidget {
//   final String channelId;

//   ChatScreen({required this.channelId});

//   @override
//   Widget build(BuildContext context) {
//     return MaterialApp(
//       builder: (context, child) {
//         return StreamChat(
//           client: StreamChatService.client,
//           child: child,
//         );
//       },
//       home: Scaffold(
//         body: StreamChannel(
//           channel: channelId,
//           child: const Column(
//             children: <Widget>[
//               Expanded(
//                 child: MessageListView(),
//               ),
//               MessageInput(),
//             ],
//           ),
//         ),
//       ),
//     );
//   }
// }
