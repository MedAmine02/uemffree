// import 'package:flutter/material.dart';
// import 'package:stream_chat_flutter/stream_chat_flutter.dart';
// import 'package:uemffree/chat_screen.dart';
// import 'package:uemffree/services/stream_chat_service.dart';

// class ConversationListPage extends StatelessWidget {
//   @override
//   Widget build(BuildContext context) {
//     return MaterialApp(
//       builder: (context, child) {
//         return StreamChat(
//           client: StreamChatService.client,
//           child: child,
//         );
//       },
//       home: StreamChannel(
//         channel: StreamChannel.of(context).channel,
//         child: StreamChannelListView(
//           onChannelTap: (channel, _) {
//             Navigator.push(
//               context,
//               MaterialPageRoute(
//                 builder: (context) => ChatScreen(
//                   channelId: channel.cid,
//                 ),
//               ),
//             );
//           },
//         ),
//       ),
//     );
//   }
// }
